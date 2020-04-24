<script>
import axios from 'axios'
export let title
export let id
export let content
export let position
export let numberOfComments

// collapsed, expanding, error, timeout, expanded, expandedAndVideoLoaded
let state = 'collapsed'
let cachedDetail
let detail

let time = 0
let paused = false
let volume

const toggleState = async () => {
  switch(state){
    case 'collapsed':
    case 'error':
    case 'timeouterror': {
      if(cachedDetail){
        detail = cachedDetail
        state = 'expanded'
      } else {
        state = 'expanding'
        try {
          cachedDetail = await axios.get(`https://blog-demo-create.herokuapp.com/comments/${id}`, {
            timeout: 2500
          }).then(res=>res.data)
        } catch (error) {
          if(error.code === 'ECONNABORTED'){
            state = 'timeout'
          } else {
            console.error(error)
            state = 'error'
          }
        }
        if(state === 'expanding'){
          detail = cachedDetail
          state = 'expanded'
        }
      }
      break
    }
    case 'expanding': {
      break
    }
    case 'expanded': {
      break
    }
    case 'expandedAndVideoLoaded': {
      state = 'collapsed'
      break
    }
    default: {
      break
    }
  }
}

</script>

<article tabindex="0" aria-labelledby={`comment-${position}`} aria-describedby={`comment-${position}-content`} aria-posinset={position} aria-setsize={numberOfComments}>
  <h2 id={`comment-${position}`}>{title}</h2>
  <div id={`comment-${position}-content`}>
    <p>
      {#if state === 'collapsed'}
        {content}
      {:else if state === 'expanding'}
        {content}
      {:else if state === 'error'}
        <p>An error occurred</p>
      {:else if state === 'timeout'}
        <p>Request timeout</p>
      {:else if state === 'expanded'}
        {content}
      {:else if state === 'expandedAndVideoLoaded'}
        {detail.content}
      {/if}
    </p>

    {#if state==='expanded' || state === 'expandedAndVideoLoaded'}
      <video
        controls
        bind:currentTime={time}
        bind:paused
        bind:volume
        src={`https://blog-demo-create.herokuapp.com${detail.video}`}
        on:loadedmetadata={async (event)=> {
          event.target.currentTime = time
          if(!paused){
            await event.target.play()
          }
          if(state === 'expanded'){
            state = 'expandedAndVideoLoaded'
          }
        }}
        on:error={error => {
          state = 'error'
        }}
        hidden={state !== 'expandedAndVideoLoaded'}
      />
    {/if}
  </div>

  <button on:click={toggleState} disabled={state==='expanding'} aria-label={
  state==='collapsed' ? 'Show more' : state === 'expanding' ? 'Show more' : 'Show less'
  }
    aria-controls={`comment-${position}-content`}
    aria-expanded={state === 'expanded' || state === 'expandedAndVideoLoaded'}
    data-state={state}
  >
    <img src="/Arrow.svg" alt="" />
  </button>
</article>


<style>
article {
  border-radius: .5rem;
  border: 1px solid lightgray;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

article:focus {
  outline: none;
  border-color: burlywood;
}

article:focus-within{
  border-color: burlywood;
}

video {
  width: calc(100% + 2rem + 2px); /* padding and border */
  margin-left: calc(-1rem - 1px); /* padding and border */
  margin-right: calc(-1rem - 1px); /* padding and border */
}

button {
  margin-top: .5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: burlywood;
  border: none;
  align-self: flex-end;
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #fff,
              0 0 0 4px burlywood,
              0 0 0 6px burlywood;
}

button::-moz-focus-inner {
  border: 0;
}

button img {
  max-width: 100%;
  transform: translateY(.2rem);
}

button[data-state="expandedAndVideoLoaded"] img {
  transform: rotate(180deg)
}

button:active, button[data-state="expanding"], button[data-state="expanded"]{
  filter: grayscale(0.7);
}
</style>