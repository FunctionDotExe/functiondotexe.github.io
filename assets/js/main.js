// Main interactivity: project modal, skills chart, simple contact handling
document.addEventListener('DOMContentLoaded', function () {
  // Project modal
  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const closeBtn = document.getElementById('modalClose');
  document.querySelectorAll('.project-open').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.project;
      let html = '<h3 class="text-xl font-semibold">Project</h3>';
      if (key === 'ai') html = '<h3 class="text-xl font-semibold">AI Object Detection</h3><p class="mt-2">Built a real-time object detection pipeline (CNN) with visualization. 97% accuracy.</p>';
      if (key === 'chat') html = '<h3 class="text-xl font-semibold">Personal Chat Messenger</h3><p class="mt-2">React + Firebase secure messenger with GUI and authentication.</p>';
      if (key === 'churn') html = '<h3 class="text-xl font-semibold">Churn Modeling</h3><p class="mt-2">Data preprocessing, Keras ANN, ~90% accuracy.</p>';
      if (key === 'quantum') html = '<h3 class="text-xl font-semibold">Quantum ML Research</h3><p class="mt-2">Simulated VQEs and QNNs using Qiskit, PennyLane, and Cirq.</p>';
      modalContent.innerHTML = html;
      modal.classList.add('show');
    });
  });
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('show'));

  // Contact form: uses mailto fallback
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent('Portfolio contact from ' + data.get('name'));
      const body = encodeURIComponent(data.get('message') + '\n\n--\n' + data.get('name') + ' (' + data.get('email') + ')');
      window.location.href = `mailto:rubenbmaxwell@gmail.com?subject=${subject}&body=${body}`;
      const status = document.getElementById('contactStatus');
      if (status) status.textContent = 'Opening your email client...';
    });
  }

  // Skills chart: graceful fallback if Chart is present
  if (typeof Chart !== 'undefined') {
    const ctx = document.getElementById('skillsChart');
    if (ctx) {
      new Chart(ctx.getContext('2d'), {
        type: 'radar',
        data: {
          labels: ['HTML/CSS', 'JavaScript', 'Python', 'ML', 'Quantum'],
          datasets: [{ label: 'Skill', data: [85, 78, 82, 80, 55], backgroundColor: 'rgba(37,99,235,0.2)', borderColor: '#2563eb' }]
        },
        options: { responsive: true, scales: { r: { min: 0, max: 100 } } }
      });
    }
  }
});
