import images from './db.js'

const galleryContainer = document.querySelector('.js-gallery')
const modal = document.querySelector('.js-lightbox')
const modalImg = document.querySelector('.lightbox__image')

const overlay = document.querySelector('.lightbox__overlay')
const modalBtnClose = document.querySelector('.lightbox__button')

galleryContainer.addEventListener('click', modalOpen)
galleryContainer.insertAdjacentHTML('beforeend', galleryCardMarkup(images))

function galleryCardMarkup(images) {
  return images
    .map(({ preview, original, description }) => {
      return `<li class="gallery__item">
            <a class="gallery__link"
            href=${original}>
            <img
            loading="lazy"
            class="gallery__image lazyload"
            data-src=${preview}
            data-source=${original}
            alt=${description} />
            </a>
            </li>`
    })
    .join('')
}

function modalOpen(event) {
  event.preventDefault()

  if (event.target.nodeName !== 'IMG') {
    return
  }
  modal.classList.add('is-open')
  modalImg.src = event.target.dataset.source
  modalImg.alt = event.target.alt
  overlay.addEventListener('click', modalCloseByOverlayClick)
  document.addEventListener('keydown', modalCloseByEsc)
  modalBtnClose.addEventListener('click', modalClose)
}

function modalClose(event) {
  modal.classList.remove('is-open')
  overlay.removeEventListener('click', modalCloseByOverlayClick)
  document.removeEventListener('keydown', modalCloseByEsc)
  modalBtnClose.removeEventListener('click', modalClose)
  window.removeEventListener('keydown', onArrowsSwitchImg)
}

function modalCloseByEsc(event) {
  if (event.code === 'Escape') {
    modalClose(event)
  }
}

function modalCloseByOverlayClick(event) {
  if (event.currentTarget === event.target) {
    modalClose(event)
  }
}
// <---  --->
const BtnNext = document.querySelector('[data-action=scroll-right]')
const BtnPrevious = document.querySelector('[data-action=scroll-left]')
BtnNext.addEventListener('click', onArrowBtnsClick)
BtnPrevious.addEventListener('click', onArrowBtnsClick)
window.addEventListener('keydown', onArrowsSwitchImg)

function onArrowBtnsClick(event) {
  const isNextBtn = event.target === BtnNext
  const isPreviousBtn = event.target === BtnPrevious

  if (isNextBtn) {
    // console.log(event.target.nodeName);//BUTTON
    // console.log(event.target.code);
    onNextSwitchImg()
  }

  if (isPreviousBtn) {
    onPreviousSwitchImg()
  }
}

function onNextSwitchImg() {
  for (let i = 0; i < images.length - 1; i += 1) {
    if (modalImg.src === images[i].original) {
      modalImg.src = images[i + 1].original
      modalImg.alt = images[i + 1].description
      break
    }
  }
}

function onPreviousSwitchImg() {
  for (let i = images.length - 1; i > 0; i -= 1) {
    if (modalImg.src === images[i].original) {
      modalImg.src = images[i - 1].original
      modalImg.alt = images[i - 1].description
      break
    }
  }
}
function onArrowsSwitchImg(event) {
  const ARROWLEFT_KEY_CODE = 'ArrowLeft'
  const ARROWRIGHT_KEY_CODE = 'ArrowRight'

  const currentIndex = images.findIndex(item => item.original === modalImg.src)

  const prevIndex = currentIndex - 1
  const nextIndex = currentIndex + 1

  if (event.code !== ARROWLEFT_KEY_CODE && event.code !== ARROWRIGHT_KEY_CODE) return

  if (event.code === ARROWLEFT_KEY_CODE && prevIndex >= 0) {
    modalImg.setAttribute('src', `${images[prevIndex].original}`)
    modalImg.setAttribute('alt', `${images[prevIndex].description}`)
    return modalImg
  }

  if (event.code === ARROWRIGHT_KEY_CODE && nextIndex < images.length) {
    modalImg.setAttribute('src', `${images[nextIndex].original}`)
    modalImg.setAttribute('alt', `${images[nextIndex].description}`)
    return modalImg
  }
}

// feature detection
if ('loading' in HTMLImageElement.prototype) {
  addSrcAttrToLazyImages()
} else {
  addLazySizesScript()
}

const lazyImages = document.querySelectorAll('img[data-src]')

function addSrcAttrToLazyImages() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]')
  lazyImages.forEach(img => {
    img.src = img.dataset.src
  })
}

function addLazySizesScript() {
  const script = document.createElement('script')
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js'
  script.integrity = 'sha512-q583ppKrCRc7N5O0n2nzUiJ+suUv7Et1JGels4bXOaMFQcamPk9HjdUknZuuFjBNs7tsMuadge5k9RzdmO+1GQ=='
  script.crossorigin = 'anonymous'
  script.referrerpolicy = 'no-referrer'
  document.body.appendChild(script)
}
