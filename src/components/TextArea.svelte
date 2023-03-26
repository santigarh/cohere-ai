<script>
  import { checkIsEnglish } from '../services/ia'
  import { isValidInput } from './store'
  import debounce from 'just-debounce-it'

  const handleChange = async (e) => {
    const { innerText } = e.target
    const isValid = innerText.length > 0
    if (!isValid) {
      isValidInput.set(false)
      return
    }

    await debounce(checkIsEnglish(innerText), 500)
  }
</script>

<label class="text-gray-700" for="name">
  <div
    on:input={handleChange}
    class="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
    id="result"
    contenteditable="true"
  />
</label>
