export const NOTEBOOKS = [
  {
    title: "Quantum image reconstruction",
    description: "Experiments with Qiskit circuits, grayscale image patches, and k-space data.",
    tools: "Qiskit / Python",
    link: "https://colab.research.google.com/drive/1H-MVU9eA7-yUvf8jxHFMoIZ2QA960xUn?usp=sharing",
    image: { src: "/media/work/notebook-quantum.webp", width: 1179, height: 609, alt: "Saved notebook output comparing an original scan with a patch-based quantum reconstruction" },
  },
  {
    title: "Data visualization",
    description: "A few NumPy and Matplotlib exercises, from velocity plots to comparing equations.",
    tools: "NumPy / Matplotlib",
    link: "https://colab.research.google.com/drive/1eTbkqPtoE0gpiHixxdnbqde5Z3_2cOw5?usp=sharing",
    image: { src: "/media/work/notebook-plotting.webp", width: 562, height: 455, alt: "Car velocity plotted against time in Matplotlib" },
  },
  {
    title: "MRI reconstruction",
    description: "A PyTorch experiment reconstructing images from undersampled k-space data. Includes saved results and comparisons.",
    tools: "PyTorch / Python",
    link: "https://colab.research.google.com/drive/1tXm4A8NJ5Rpyhm3MIthAiAy8hLaLVDfS?usp=sharing",
    image: { src: "/media/work/notebook-mri.webp", width: 1174, height: 407, alt: "Experimental MRI output: undersampled input, early reconstruction, and ground truth" },
  },
];
