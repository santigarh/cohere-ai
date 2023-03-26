import { isValidInput } from '.././components/store'

const COHERE_API_KEY = 'KOXkqXDz4w0L4CazD5FwG9vL6h91qQ7ms3DZuSNh'
const COHERE_API_URL = 'https://api.cohere.ai/generate'
const COHERE_API_URL_DETECT_LENGUAGE =
  'https://api.cohere.ai/v1/detect-language'

export async function checkIsEnglish(input) {
  const data = {
    texts: [input],
  }

  const { results } = await fetch(COHERE_API_URL_DETECT_LENGUAGE, {
    method: 'POST',
    headers: {
      Authorization: `BEARER ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
      'Cohere-Version': '2022-12-06',
    },
    body: JSON.stringify(data),
  }).then((res) => res.json())

  const [{ language_code }] = results
  const isEnglish = language_code === 'en'
  isValidInput.set(isEnglish)
}

export async function fixMyEnglish(input) {
  const data = {
    model: 'xlarge',
    prompt: `This is a spell checker genrator.
          --
          Incorect sample: "I are good!"
          Correct sample: "I am good!"
          --
          Incorect sample: "I have 22 years old."
          Correct sample: "I am 22 years old"
          --
          Incorect sample: "I don't can know"
          Correct sample: "I adon't now"
          --
          Icorrect sample : "${input}"
          Correct sample:`,
    max_tokens: 40,
    temperature: 0.3,
    k: 0,
    p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop_sequences: ['--'],
    return_likelihoods: 'NONE',
  }

  const response = await fetch(COHERE_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `BEARER ${COHERE_API_KEY}`,
      'Content-Type': 'application/json',
      'Cohere-Version': '2022-12-06',
    },
    body: JSON.stringify(data),
  }).then((res) => res.json())

  const { text } = response.generations[0]

  return text.replace('--', '').replaceAll('"', '').trim()
}
