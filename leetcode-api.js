const axios = require("axios");

const QUESTION_FRAGMENT = `
  fragment QuestionFields on QuestionNode {
    id: questionId
    title
    titleSlug
    complexity: difficulty
    description: content
    topicTags {
      name
    }
  }
`;

const PROBLEM_QUERY = `
  ${QUESTION_FRAGMENT}
  query ($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      ...QuestionFields
    }
  }
`;

const DAILY_PROBLEM_QUERY = `
  ${QUESTION_FRAGMENT}
  query {
    dailyProblem: activeDailyCodingChallengeQuestion {
      date
      question {
        ...QuestionFields
      }
    }
  }
`;

function cleanupQuestion(question) {
  const { id, title, titleSlug, complexity, description, topicTags } = question;
  const categories = topicTags.map(({ name }) => name);
  const link = `https://leetcode.com/problems/${titleSlug}/`;

  return { id, title, description, complexity, categories, link };
}

/**
  * Creates a query to the Leetcode GraphQL API.
  */
async function createLeetcodeQuery(query, variables) {
  const response = await axios.get("https://leetcode.com/graphql", {
    data: { query, variables },
  });
  if (response.status !== 200) {
    throw new Error(`Request did not succeed: ${JSON.stringify(response.data)}`);
  }
  return response.data.data;
}

async function getLeetcodeProblemOfTheDay() {
  const data = await createLeetcodeQuery(DAILY_PROBLEM_QUERY);
  const question = cleanupQuestion(data.dailyProblem.question);
  return question;
}

async function getLeetcodeProblem(titleSlug) {
  const data = await createLeetcodeQuery(PROBLEM_QUERY, { titleSlug });
  const question = cleanupQuestion(data.question);
  return question;
}

module.exports = { getLeetcodeProblem, getLeetcodeProblemOfTheDay };
