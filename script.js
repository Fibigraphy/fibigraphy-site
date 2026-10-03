const galleryImages = [...document.querySelectorAll('.gallery-item img')];
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const closeButton = lightbox.querySelector('.lightbox-close');
const prevButton = lightbox.querySelector('.lightbox-prev');
const nextButton = lightbox.querySelector('.lightbox-next');
const count = lightbox.querySelector('.lightbox-count');
let currentIndex = 0;

function showImage(index) {
  currentIndex = (index + galleryImages.length) % galleryImages.length;
  const image = galleryImages[currentIndex];
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  count.textContent = String(currentIndex + 1).padStart(2, '0') + ' / ' + String(galleryImages.length).padStart(2, '0');
}
function openLightbox(index) {
  showImage(index);
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
  document.body.style.overflow = '';
}
galleryImages.forEach((image, index) => image.addEventListener('click', () => openLightbox(index)));
closeButton.addEventListener('click', closeLightbox);
prevButton.addEventListener('click', () => showImage(currentIndex - 1));
nextButton.addEventListener('click', () => showImage(currentIndex + 1));
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
  if (event.key === 'ArrowRight') showImage(currentIndex + 1);
});