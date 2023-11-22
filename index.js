const axios = require("axios");
const {getLeetcodeProblemOfTheDay, getLeetcodeProblem} = require("./leetcode-api");

const QUESTION_API_URL = process.env.QUESTION_API_URL || "http://localhost:3001";

async function createQuestion(question, token) {
  try {
    const response = await axios.post(
      `${QUESTION_API_URL}/`,
      question,
      {
        headers: { Authorization: `Bearer ${token}` }
      },
    );

    if (response.status !== 201) {
      throw new Error(`Could not create question: ${JSON.stringify(response.data)}`);
    }
    return response.data;
  } catch(err) {
    console.error(error);
  }
}

exports.syncQuestionOfTheDay = async (req, res) => {
  const token = (req.headers.authorization ?? "").split(" ")[1];
  const question = await getLeetcodeProblemOfTheDay();
  const createQuestionResponse = await createQuestion(question, token);
  console.log(createQuestionResponse);

  res.json(createQuestionResponse.res);
};

exports.syncQuestion = async (req, res) => {
  const token = (req.headers.authorization ?? "").split(" ")[1];
  const questionSlug = req.body.question;
  const question = await getLeetcodeProblem(questionSlug);
  const createQuestionResponse = await createQuestion(question, token);

  res.json(createQuestionResponse.res);
}
