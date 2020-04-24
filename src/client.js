import * as sapper from '@sapper/app'

sapper.start({
  target: document.querySelector('#sapper'),
})

const noOutlineOnClick = () => {
  const s = document.createElement('style')
  document.getElementsByTagName('head')[0].appendChild(s)
  window.addEventListener(
    'mousedown',
    () =>
      (s.innerHTML =
        ':focus{outline:0;box-shadow:none !important}::-moz-focus-inner{border:0;}'),
  )
  window.addEventListener(
    'keydown',
    (event) =>
      [9, 32, 37, 38, 39, 40].includes(event.keyCode) && (s.innerHTML = ''),
  )
}

noOutlineOnClick()
