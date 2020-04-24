
<script>
import CommentFeed from '../components/CommentFeed.svelte'
import { onMount } from 'svelte';
import axios from 'axios'

let comments = []
// loading, error, timeout, done
let state = 'loading'

onMount(async ()=>{
	try {
		comments = await axios.get(`https://blog-demo-create.herokuapp.com/comments`, {timeout: 2000}).then(res=>res.data)
		state = 'done'
	} catch (error) {
		if(error.code === 'ECONNABORTED'){
			state = 'timeout'
		} else {
			console.error(error)
			state = 'error'
		}
	}
})
</script>

<svelte:head>
  <title>Comments</title>
</svelte:head>

<main>
	{#if state === 'loading' }
		<p class="status">Loading comments...</p>
	{:else if state === 'error'}
		<p class="status">An error occurred</p>
	{:else if state === 'timeout'}
		<p class="status">Request Timeout</p>
	{:else}
    <h1>Comments</h1>
		<CommentFeed comments={comments} />
	{/if}

</main>

<style>
main {
	display: flex;
	flex-direction: column;
	width: 100%;
	align-items: center;
}

.status {
	margin-top: 2rem;
}

h1 {
	margin-top: 1rem;
}

</style>