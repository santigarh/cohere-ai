<script>
  import { fixMyEnglish } from '../services/ia'
  import Loading from './icons/Loading.svelte'
  import { isValidInput } from './store'

  let promise = null

  const handleClick = async () => {
    const text = document.getElementById('result').innerText

    promise = fixMyEnglish(text)
    const value = await promise

    const responseResalted = diffString(text, value)

    document.getElementById('result').innerHTML = responseResalted
    promise = null
  }

  function diffString(a, b) {
    var i,
      j,
      result = ''
    var d = [] // matriz de distancias

    // inicializar la matriz de distancias
    for (i = 0; i <= a.length; i++) {
      d[i] = []
      d[i][0] = i
    }
    for (j = 0; j <= b.length; j++) {
      d[0][j] = j
    }

    // calcular la matriz de distancias
    for (i = 1; i <= a.length; i++) {
      for (j = 1; j <= b.length; j++) {
        if (a[i - 1] == b[j - 1]) {
          d[i][j] = d[i - 1][j - 1]
        } else {
          d[i][j] = Math.min(d[i - 1][j], d[i][j - 1], d[i - 1][j - 1]) + 1
        }
      }
    }

    // construir la cadena de diferencias
    i = a.length
    j = b.length
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && a[i - 1] == b[j - 1]) {
        result = a[i - 1] + result
        i--
        j--
      } else if (j > 0 && d[i][j] == d[i][j - 1] + 1) {
        result = "<span class='text-pink-600'>" + b[j - 1] + '</span>' + result
        j--
      } else if (i > 0 && d[i][j] == d[i - 1][j] + 1) {
        result = "<span class='text-pink-600'>" + a[i - 1] + '</span>' + result
        i--
      } else if (i > 0 && j > 0 && d[i][j] == d[i - 1][j - 1] + 1) {
        result = "<span class='text-pink-600'>" + b[j - 1] + '</span>' + result
        i--
        j--
      }
    }

    return result
  }
</script>

{#if promise === null}
  <button
    on:click={handleClick}
    disabled={!$isValidInput}
    type="button"
    class={`py-2 px-4 bg-pink-600 hover:bg-pink-700 focus:ring-pink-500 focus:ring-offset-pink-200 text-white w-full transition ease-in duration-200 
    text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full
    ${!$isValidInput ? 'pointer-events-none opacity-30' : ''}`}
  >
    Please fix my English
  </button>
{:else}
  {#await promise}
    <button
      type="button"
      class=" pointer-events-none py-2 px-4 flex justify-center items-center  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
    >
      <Loading />
      Loading..
    </button>
  {/await}
{/if}

{#if !$isValidInput}
  <strong class="text-red-800">
    You are not using English or is too short!</strong
  >
{/if}
