---
project: "All-Sky Imaging & Multimodal Solar Irradiance Forecasting"
projectMembers: []
supervisors: []
researchArea: Computer Vision
researchPillars: []
coverImage: ./cover_images/CV_Irradiance.jpg
---

Our research group develops deep learning systems that forecast short-term solar irradiance by fusing **all-sky imagery (ASI)** with time-series meteorological data. A core theoretical question we investigate is how ***vision and temporal features can be combined synergistically*** extracting maximum forecasting accuracy at the lowest architectural complexity, rather than treating spatial cloud structure and temporal irradiance dynamics as separate problems. This led to **SolarMamba**, an SSM-based backbone that models cloud motion and irradiance sequences jointly. To rigorously identify which *visual backbones* actually matter for this task, we developed a **Controlled Visual-Backbone Benchmark for Multimodal Short-Term Solar Irradiance Forecasting**, isolating the contribution of backbone choice under a fair, matched evaluation protocol. A newer theoretical thread tackles a fundamental optical distortion problem: *all-sky cameras capture clouds through a fisheye lens onto a flat sensor, warping true cloud geometry and motion*. We are researching whether **undistorting ASI images by projecting cloud motion onto the correct hemispherical manifold**, informing the model of clouds true 3D motion rather than their flattened 2D projection  measurably improves downstream forecasting accuracy.
