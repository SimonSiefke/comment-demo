<script>
import Comment from './Comment.svelte'
import {onMount} from 'svelte'

export let comments

onMount(()=>{
  const feed = document.getElementById('feed')
  const feedItems = Array.from(feed.children)
  feed.addEventListener('keydown', (event)=>{
    const focusedArticle = event.target.closest('article')
    const index = parseInt(focusedArticle.getAttribute('aria-posinset') -1)
    switch(event.key){
      case 'PageUp': {
        event.preventDefault()
        if(index > 0){
          feedItems[index-1].focus()
        }
        break
      }
      case 'PageDown': {
        event.preventDefault()
        if(index < comments.length -1){
          feedItems[index+1].focus()
        }
        break
      }
      case 'Home': {
        if(event.ctrlKey){
          event.preventDefault()
          feedItems[0].focus()
          feedItems[0].scrollIntoView()
        }
        break
      }
      case 'End': {
        if(event.ctrlKey){
          event.preventDefault()
          feedItems[feedItems.length-1].focus()
          feedItems[feedItems.length-1].scrollIntoView()
        }
        break
      }
      default: {
        break
      }
    }
  })
})
</script>

<section id="feed" role="feed">
  {#each comments as comment, index}
    <Comment {...comment} position={index+1} numberOfComments={comments.length} />
  {/each}
</section>

<style>
#feed {
  width: calc(100% - 1.6rem);
  display: grid;
	grid-row-gap: .8rem;
  max-width: 600px;
}
</style>