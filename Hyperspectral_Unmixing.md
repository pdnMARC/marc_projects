---
project: "Hyperspectral Unmixing"
projectMembers: 
 - dmu.praveen@gmail.com
 - tharuwicky7273@gmail.com
 - e19445@eng.pdn.ac.lk
supervisors: 
 - "roshang@eng.pdn.ac.lk"
researchArea: Computer Vision
researchPillars: 
 - "AI in Engineering"
 - "AI in Climate Change"
coverImage: ./cover_images/Hyperspectral_Unmixing.jpg
---
Hyperspectral unmixing is the problem of recovering the pure spectral signatures (endmembers) and their fractional abundances from pixel-level hyperspectral measurements. Our lab studies principled, mathematically-grounded methods that combine physics-aware models, statistical inference, and modern machine learning to improve accuracy, interpretability, and robustness of unmixing in realistic scenarios (illumination changes, topography, intimate mixtures, noise, and nonlinear mixing).

***

## Motivation & importance
Hyperspectral sensors measure reflectance (or radiance) in hundreds of narrow spectral bands. Because of limited spatial resolution and sub-pixel heterogeneity, each measured spectrum is typically a mixture of several materials. Accurate unmixing enables:

- Material identification and mapping (mineralogy, vegetation species, urban materials).  
- Quantitative retrievals for environmental monitoring, precision agriculture, and planetary science.  
- Downstream tasks such as classification, anomaly detection, and physics-based parameter estimation.

Understanding and modelling the mixing process is therefore essential for converting high-dimensional spectral data into actionable, quantitative information.

***

## Problem statement (mathematical)
Let $ \mathbf{x}\in\mathbb{R}^L $ denote the observed spectrum at one pixel (L spectral bands). Under the widely-used **Linear Mixing Model (LMM)**:
$$
\mathbf{x} = \mathbf{M}\,\mathbf{a} + \mathbf{n},
$$
where
- $ \mathbf{M} = [\mathbf{m}_1, \mathbf{m}_2, \dots, \mathbf{m}_p] \in \mathbb{R}^{L\times p} $ is the matrix of $p$ endmember spectra,
- $ \mathbf{a}\in\mathbb{R}^p$ is the abundance vector for that pixel,
- $ \mathbf{n}$ is additive noise.

Physically meaningful constraints are often imposed:
$$
a_i \ge 0\quad\forall i,\qquad \sum_{i=1}^p a_i = 1 \quad\text{(optional, depending on normalization).}
$$

Typical inverse tasks:
1. **Endmember extraction** — estimate $ \mathbf{M} $ from the hyperspectral image (unsupervised) or from a library (semi-/supervised).  
2. **Abundance estimation** — solve for $ \mathbf{a} $ given $ \mathbf{x} $ and $ \mathbf{M} $.

A common formulation for abundance estimation is constrained least squares:
$$
\min_{\mathbf{a}} \ \| \mathbf{x} - \mathbf{M}\mathbf{a}\|_2^2 \quad\text{s.t.}\quad \mathbf{a}\ge 0,\ \mathbf{1}^\top\mathbf{a}=1.
$$

We also study **nonlinear mixing** (e.g., intimate mixtures, multiple scattering), where models become
$$
\mathbf{x} = f(\mathbf{M},\mathbf{a}) + \mathbf{n},
$$
and $f$ is a nonlinear operator—requiring more sophisticated inversion strategies.

***

## Approaches & algorithms we develop
Our research spans theory, algorithms, and applications. Representative areas include:

- **Geometric/convex methods** – exploit simplex geometry of LMM (e.g., pure-pixel assumptions, convex geometry) for endmember extraction and identifiability analysis.  
- **Sparse and dictionary-based unmixing** – represent spectra as sparse combinations from large spectral libraries; solve with sparse optimization (LASSO, constrained variants).  
- **Statistical / Bayesian methods** – hierarchical priors on endmembers and abundances, uncertainty quantification, and posterior inference (MCMC, variational inference).  
- **Nonlinear modeling** – physics-inspired nonlinear models (bilinear, intimate mixing, radiative-transfer-inspired) and kernel-based or neural-network surrogates for $f$.  
- **Deep learning methods** – supervised and self-supervised architectures that learn endmember dictionaries, abundance estimation networks, or end-to-end inversion while respecting physical constraints (non-negativity, sum-to-one).  
- **Spatial–spectral regularization** – incorporate spatial smoothness and structure via Markov random fields, total variation, or graph-based priors to improve robustness.

We emphasize models that are interpretable and that provide uncertainty estimates, not black-box predictions.

***

## Optimization & evaluation
Typical optimization tools we use include constrained quadratic programming, projected gradient methods, alternating optimization (for bilinear problems), convex relaxations, and proximal algorithms for nonsmooth regularizers. For probabilistic models we use MAP estimation, variational inference, and sampling.

Evaluation metrics commonly used in our work:
- **Spectral Angle Distance (SAD)** between true and estimated endmembers.  
- **Root Mean Square Error (RMSE)** for abundance estimates.  
- **Reconstruction error** $ \|\mathbf{x} - \hat{\mathbf{M}}\hat{\mathbf{a}}\|_2 $.  
- Task-driven metrics (classification accuracy, material detection ROC) when unmixing feeds downstream tasks.

***

## Datasets & benchmarking (high-level)
We validate methods on a mixture of controlled synthetic scenes (where mixing physics can be simulated), laboratory measurements, and real airborne/satellite imagery. We place particular emphasis on testing across conditions that violate simple assumptions (nonlinearity, varying illumination, topography) to stress-test algorithms.

***

## Open research directions we pursue
- **Identifiability under realistic physics**: when and how can we uniquely recover endmembers and abundances when mixing is nonlinear or when pure pixels are absent?  
- **Uncertainty-aware unmixing**: principled quantification of confidence in endmember/abundance estimates.  
- **Hybrid physics + learned models**: combining radiative transfer models with data-driven components for improved generalization.  
- **Scalable algorithms**: distributed and streaming methods for very large hyperspectral datasets.  
- **Domain adaptation**: transferring models across sensors, viewing geometries, and illumination conditions.

***

## Who should care 
Our work is relevant to engineers, applied mathematicians, remote sensing scientists, and practitioners in agriculture, geology, environmental monitoring, and planetary science who need accurate material mapping and quantitative retrievals from hyperspectral imagery.

***

## Get involved 
If you are interested in contributing, collaborating, or applying these methods to new datasets or application domains, please contact the lab lead or the hyperspectral unmixing project team via the lab website (project page / contact form). We welcome students and collaborators from signal processing, optimization, statistics, and machine learning backgrounds.

***
