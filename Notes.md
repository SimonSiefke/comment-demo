# Notes

## [Index Component](./src/routes/index.svelte)

The Index Component fetches the comments when it is mounted and then renders the comment feed component, passing the comments array as a prop.

It has a loading state that is modeled as a finite state machine with 4 states:

- `loading`: The comments are being fetched
- `error`: Client or server error
- `timeout`: Timeout error
- `done`: The comments have been fetched

## [Comment Feed Component](./src/components/CommentFeed.svelte)

The Comment Feed Component has 1 prop: `comments`. It renders the each comment using the Comment component. It also handles the focus management of the articles.

## [Comment Component](./src/components/Comment.svelte)

The Comment Component has 5 props: `title`, `content`, `id`, `position`, `numberOfComments`.

It has a expansion state that is modeled as a finite state machine with 6 states:

- `collapsed`: The comment is collapsed
- `expanding`: The data is being fetched
- `error`: Client or server error
- `timeout`: Timeout error
- `expanded`: The data has been fetched (but video has not yet loaded)
- `expandedAndVideoLoaded`: The data has been fetched and the video has loaded

It also stores the video time, whether the video is paused or not and the volume so that the video can be resumed normally after the comment has been collapsed.
