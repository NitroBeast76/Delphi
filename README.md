# Delphi — Intelligence at Home

<p align="center">
  <strong>A premium, zero-configuration local intelligence studio and offline GUI for image generation, language models, speech-to-text, and natural voice. Powered by hardware-accelerated GPU and NPU execution on Windows, Linux, and macOS.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Offline-100%25-green?style=for-the-badge&logo=offline" alt="100% Offline" />
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-blue?style=for-the-badge" alt="Platforms" />
  <img src="https://img.shields.io/badge/License-MIT-orange?style=for-the-badge" alt="License" />
</p>

---


## 📖 Table of Contents

* [What is Delphi?](#what-is-delphi)
* [Key Features](#key-features)
* [Workspace & Engine Architecture](#workspace-architecture)
* [Supported Models](#supported-models)
* [Folder Architecture](#folder-architecture)
* [Getting Started](#getting-started)

  * [Windows Setup](#windows-setup)
  * [Linux Setup](#linux-setup)
  * [macOS Setup](#macos-setup)
* [📚 Tutorials](#tutorials)
* [Hardware Compatibility & Acceleration](#hardware-compatibility-acceleration)
* [Troubleshooting & FAQ](#troubleshooting-faq)
* [Building From Source](#building-from-source)
* [Acknowledgements](#acknowledgements)
* [Licensing](#licensing)

---

## <a id="what-is-delphi"></a>📖 What is Delphi?

**Delphi — Intelligence at Home** is a completely offline, zero-setup, self-contained creative intelligence studio for Windows, Linux, and macOS. Unlike cloud-based AI systems, it runs entirely on your own hardware with no tracking, subscriptions, or login requirements.

It unifies four major local AI capabilities into one high-performance desktop interface:
1. **🎨 Image Generation (Stable Diffusion):** Generate and edit high-quality images offline using `.safetensors`, `.gguf`, or `.ckpt` model weights.
2. **💬 Text Chat (LLMs):** Converse privately with open-source language models (GGUF format) powered by official, high-performance `llama.cpp` backends.
3. **🎙️ Speech-to-Text (Whisper):** Transcribe voice recordings and speech to text in real-time with an integrated `whisper.cpp` engine.
4. **🗣️ Text-to-Speech (Kokoro TTS):** Convert text outputs into highly natural, lifelike vocal audio offline using the `Kokoro-82M` ONNX model.

---

## <a id="key-features"></a>🌟 Key Features

*   **100% Offline & Private:** Run inferences locally. No internet, telemetry, cloud logging, or API keys required.
*   **Zero-Install Portability:** Entire runtime (Node.js, models, GPU backends) is self-contained. Zero global system environment changes.
*   **Auto-Configured Acceleration:** Auto-detects hardware specs to load CUDA (Nvidia), ROCm (AMD), Vulkan (Intel/AMD/NVIDIA), Metal (macOS), or OpenVINO (Intel NPU) backends.
*   **Integrated Model Manager:** Paste Hugging Face URLs to download weights directly, or drag-and-drop local weights to import them.
*   **Live Performance Monitor:** Track CPU, RAM, GPU, and VRAM utilization in real-time directly inside the web UI.
*   **Local Output Gallery:** Saves generated images side-by-side with prompt parameters and metadata JSON files.

---

## <a id="workspace-architecture"></a>⚙️ Workspace & Engine Architecture

To avoid exhausting system RAM or VRAM, text and image engines are mutually exclusive by default. You can switch between workspaces inside the UI:

*   **Image Generation Workspace:** Uses a dedicated `stable-diffusion.cpp` backend node. Model weights are stored in `app/models/`.
*   **Text Chat Workspace:** Uses a portable `llama.cpp` server backend. Model weights (.gguf) are stored in `app/llm-models/`. A small Qwen2.5 Coder starter model can be downloaded directly from the Text Chat panel.
*   **Speech Worker (Whisper):** Runs a localized `whisper-cli` process to convert your vocal input to text.
*   **Audio Output (Kokoro TTS):** Utilizes `kokoro-js` locally on the server side to read responses in natural voices.

---

## <a id="supported-models"></a>Supported Models

The app is designed around single-file local models that can be loaded directly by the bundled backend engines.

### Image generation

| Model type | Supported | Put files in | Notes |
| :--- | :--- | :--- | :--- |
| Stable Diffusion 1.5 checkpoints | Yes | `app/models/` | Best compatibility. Use `.safetensors` or `.ckpt` files. |
| SDXL checkpoints | Yes | `app/models/` | Supported as single-file checkpoints. Requires more RAM/VRAM than SD 1.5. |
| Single-file SD/SDXL GGUF checkpoints | Limited | `app/models/` | Only complete single-file checkpoints are supported. |
| OpenVINO image model folders | Intel NPU only | `app/openvino-models/` | Download from the Model Manager after running the OpenVINO setup. |
| CoreML image models | Apple Silicon only | `app/models/` | Requires macOS on Apple Silicon and the CoreML setup path. |
| Flux, HiDream, Hunyuan, Wan, Qwen Image, Z-Image workflows | No | N/A | These usually require separate diffusion, VAE, and text encoder files and are not one-click checkpoint loads in this app. |
| LoRA, ControlNet, VAE-only, text-encoder-only, or diffusion-only files | No | N/A | Companion files are not loaded as standalone image models. |

Known-good image models available from the Model Manager:

| Name | Filename | Type | Approx. size | Recommended use |
| :--- | :--- | :--- | :--- | :--- |
| Juggernaut XL v9 Lightning | `Juggernaut_RunDiffusionPhoto2_Lightning_4Steps.safetensors` | SDXL | 6.6 GB | High-quality photorealism on mid/high tier machines. |
| DreamShaper XL Lightning | `DreamShaperXL_Lightning.safetensors` | SDXL | 6.6 GB | General SDXL images, fantasy, renders, and illustration. |
| DreamShaper 8 | `DreamShaper_8_pruned.safetensors` | SD 1.5 | 2.1 GB | Faster, lower-memory image generation. |
| CyberRealistic V8 | `CyberRealistic_V8_FP16.safetensors` | SD 1.5 | 2.0 GB | Realistic SD 1.5 images and lower-memory systems. |
| Rev Animated | `rev-animated-v1-2-2.safetensors` | SD 1.5 | 2.0 GB | Stylized/anime SD 1.5 images. |
| LCM DreamShaper OpenVINO | `OpenVINO/LCM_Dreamshaper_v7-fp16-ov` | OpenVINO | 2.7 GB | Intel Core Ultra NPU test model. |

### Text, speech, and TTS

| Workspace | Supported model files | Put files in | Notes |
| :--- | :--- | :--- | :--- |
| Text Chat | `.gguf` llama.cpp models | `app/llm-models/` | Use single-file GGUF chat/instruct models. Vision models may also require a matching `mmproj` file. |
| Speech-to-Text | whisper.cpp `.bin` models | `app/speech-models/` | Use Whisper GGML/whisper.cpp model files. |
| Text-to-Speech | Kokoro `.json` manifests and model assets | `app/tts-models/` / `app/tts-runtime/` | Use the built-in Kokoro setup and Model Manager entries. |

> [!NOTE]
> Linux release binaries are built for Ubuntu 24.04-era systems and require `glibc 2.38+` plus `GLIBCXX_3.4.32+`. On older Ubuntu/Debian VMs, a model such as CyberRealistic may be valid but the backend can still fail before loading it. Upgrade the VM OS or build the backend from source.

---

## <a id="folder-architecture"></a>📁 Folder Architecture

```
Delphi/
├── windows.bat                # Windows Launcher (Double-click entrypoint)
├── linux.sh                   # Linux Launcher (Terminal entrypoint)
├── mac.sh                     # macOS Launcher (Terminal entrypoint)
├── LICENSE                    # MIT Open Source License
├── .gitignore                 # Excludes models and output images from version control
├── README.md                  # Detailed system documentation
├── scripts/
│   ├── setup/                 # Platform setup and backend installers
│   ├── reset/                 # Clean install & environment repair
│   ├── server/                # UI web server and backend lifecycle manager
│   ├── workers/               # Local worker processes
│   ├── build/                 # Optional source build helpers
│   └── config/                # Runtime configuration catalogs
└── app/
    ├── frontend/              # UI source code (Vite + React)
    ├── models/                # Place image weights here (.safetensors, .gguf, .ckpt)
    ├── llm-models/            # Place text GGUF weights here
    └── outputs/               # Saved images and parameters metadata
```

---

## <a id="getting-started"></a>🚀 Getting Started

Ensure you have a modern web browser installed. Follow the quick guide below for your platform:

### Windows Setup

1. **Launch:** Double-click **`windows.bat`**.
   > [!NOTE]
   > On the first run, the script will automatically download a portable Node.js runtime and configure pre-compiled GPU/CPU backend binaries.
2. **Add Models:** Drop `.safetensors`, `.gguf`, or `.ckpt` weights into `app/models/` (or download them via the **Model Manager** tab in the UI).
3. **Generate:** Open `http://localhost:1420` in your browser, select your model, and write a prompt.

### Linux Setup

1. **Make executable:** Open a terminal in the project folder and make the script executable:
   ```bash
   chmod +x linux.sh
   ```
2. **Launch:** Run **`./linux.sh`**.
   - **NVIDIA GPU Users:** You will be prompted to set up the high-performance **CUDA** backend (downloads prebuilt or automatically compiles from source as a fallback).
   - **AMD Radeon Performance:** Run with **`./linux.sh --max-perf`** to add the ROCm backend (~1.3 GB download).
   - **Intel Core Ultra NPU:** Run with **`./linux.sh --setup-openvino`** to configure Intel NPU support (requires Intel Linux NPU driver).
3. **Add Models:** Drop your weights into `app/models/` or download them via the **Model Manager** tab.
4. **Generate:** Open `http://localhost:1420` in your browser.

### macOS Setup

1. **Make executable:** Open a terminal in the project folder and make the script executable:
   ```bash
   chmod +x mac.sh
   ```
2. **Launch:** Run **`./mac.sh`**.
   > [!IMPORTANT]
   > The prebuilt macOS backend is optimized for **Apple Silicon (M1 or newer)** and uses **Metal** GPU acceleration. *(macOS Intel hardware is completely unsupported)*.
3. **Add Models:** Drop your weights into `app/models/` or download them via the **Model Manager** tab.
4. **Generate:** Open `http://localhost:1420` in your browser.

---
## <a id="tutorials"></a>📚 Tutorials

This section provides step-by-step guides for getting the most out of Delphi. Whether you are launching Delphi for the first time or setting up a new local model, these tutorials walk through the process from start to finish.

### 🎯 Tutorial 1 — Your First Launch

The first launch is designed to require as little configuration as possible.

**Windows**

1. Download or clone the Delphi repository.

2. Open the Delphi folder.

3. Double-click `windows.bat`.

4. Allow the launcher to complete its first-time setup.

5. Once the local server starts, open:

   `http://localhost:1420`

6. Delphi will detect the available hardware and configure the appropriate backend when supported.

On subsequent launches, simply run `windows.bat` again.

**Linux**

1. Open a terminal inside the Delphi directory.

2. Make the launcher executable:

   ```bash
   chmod +x linux.sh
   ```

3. Start Delphi:

   ```bash
   ./linux.sh
   ```

4. Open:

   `http://localhost:1420`

**macOS**

1. Open a terminal inside the Delphi directory.

2. Make the launcher executable:

   ```bash
   chmod +x mac.sh
   ```

3. Start Delphi:

   ```bash
   ./mac.sh
   ```

4. Open:

   `http://localhost:1420`

---

### 🖼️ Tutorial 2 — Generate Your First Image

Delphi can run Stable Diffusion models locally through its image-generation workspace.

#### Step 1 — Add a model

Place a supported image model inside:

```text
app/models/
```

Supported formats include:

```text
.safetensors
.ckpt
.gguf
```

Alternatively, use Delphi's **Model Manager** to download a supported model directly.

#### Step 2 — Open Image Generation

Select the **Image Generation** workspace from the Delphi interface.

Your available models should appear in the model selector.

#### Step 3 — Choose a model

For a first test, a smaller SD 1.5 model is recommended because it requires less memory than SDXL.

For higher-quality photorealistic images, an SDXL model such as **Juggernaut XL v9 Lightning** can be used on suitable hardware.

#### Step 4 — Write a prompt

Enter a description of the image you want to generate.

For example:

```text
A futuristic city at night, rain-covered streets,
neon lights reflecting on the pavement, cinematic
lighting, highly detailed
```

#### Step 5 — Generate

Start the generation process and wait for the local backend to finish.

The generated image will be displayed in Delphi and saved to the local output directory.

---

### 💬 Tutorial 3 — Chat With a Local AI

Delphi's Text Chat workspace uses `llama.cpp` to run compatible GGUF language models locally.

#### Step 1 — Add a GGUF model

Place your model inside:

```text
app/llm-models/
```

The model should be a compatible `.gguf` chat or instruction model.

#### Step 2 — Open Text Chat

Switch to the **Text Chat** workspace.

#### Step 3 — Select your model

Choose the GGUF model from the model selector.

If no model is installed, Delphi may provide a starter model through the Text Chat interface.

#### Step 4 — Start chatting

Enter a message and send it.

Your conversation is processed locally by the bundled `llama.cpp` backend.

No external AI API is required.

---

### 🎙️ Tutorial 4 — Speech-to-Text

Delphi can use `whisper.cpp` to convert speech into text locally.

#### Step 1 — Install a Whisper model

Place a compatible Whisper model inside:

```text
app/speech-models/
```

#### Step 2 — Open the Speech interface

Select the speech or transcription functionality within Delphi.

#### Step 3 — Provide audio

Give Delphi a supported voice recording or audio input.

#### Step 4 — Transcribe

Delphi passes the audio to the local Whisper worker, which converts the speech into text.

The resulting transcription can then be used elsewhere inside the application.

---

### 🗣️ Tutorial 5 — Generate Natural Voice Audio

Delphi uses **Kokoro TTS** for local text-to-speech generation.

#### Step 1 — Configure Kokoro

Use Delphi's setup or Model Manager functionality to install the required Kokoro assets.

The relevant files are stored under:

```text
app/tts-models/
app/tts-runtime/
```

#### Step 2 — Enter text

Provide the text you want Delphi to speak.

#### Step 3 — Choose a voice

Select an available Kokoro voice.

#### Step 4 — Generate

Start the TTS process.

The Kokoro runtime generates the audio locally without requiring a cloud voice service.

---

### 📦 Tutorial 6 — Installing Models Through Model Manager

The **Model Manager** provides a central way to manage supported local models.

Depending on the model type, you can either download a model through the manager or import an existing model from your computer.

For image models, supported files can be placed in:

```text
app/models/
```

For LLMs:

```text
app/llm-models/
```

For Whisper:

```text
app/speech-models/
```

For Kokoro:

```text
app/tts-models/
app/tts-runtime/
```

After installing a model, restart or refresh the relevant workspace if the model does not immediately appear.

---

### 📊 Tutorial 7 — Monitoring Performance

Delphi includes a live performance monitor for observing local inference.

The monitor can display information such as:

* CPU utilization
* RAM usage
* GPU utilization
* VRAM usage

This is particularly useful when testing different models or determining whether a model is too demanding for your hardware.

If generation is extremely slow or the backend repeatedly crashes, check the available RAM and VRAM before assuming that the model itself is broken.

---

### 🔧 Tutorial 8 — Choosing the Right Backend

Delphi can use different acceleration technologies depending on your hardware.

**NVIDIA**

```text
CUDA
```

**AMD**

```text
ROCm / Vulkan
```

**Intel**

```text
Vulkan / OpenVINO
```

**Apple Silicon**

```text
Metal
```

If dedicated GPU acceleration is unavailable, Delphi can fall back to CPU execution. CPU inference is generally considerably slower, particularly with larger models.

For Linux users, additional backend setup options are available through `linux.sh`.

---

### 💾 Tutorial 9 — Keeping Delphi Portable

Delphi is designed to keep its runtime and AI resources together rather than requiring a traditional system-wide installation.

A Delphi installation can contain its application, runtime components, models, and generated outputs together:

```text
Delphi/
├── windows.bat
├── linux.sh
├── mac.sh
├── app/
│   ├── models/
│   ├── llm-models/
│   ├── speech-models/
│   ├── tts-models/
│   └── outputs/
└── scripts/
```

This makes it possible to keep Delphi on an external SSD or other portable storage and move the installation between compatible machines.

Hardware-specific acceleration requirements still apply.

---

### 🧹 Tutorial 10 — Resetting Delphi

If an installation becomes corrupted or a backend fails during setup, Delphi includes reset scripts.

**Windows**

```powershell
scripts/reset/reset.ps1
```

**Linux/macOS**

```bash
scripts/reset/reset.sh
```

The reset process removes temporary dependencies and compilation/package caches while preserving model weights and generated output images.

After resetting, launch Delphi normally and allow the required components to be configured again.

---

### 🛠️ Tutorial 11 — When Something Goes Wrong

If Delphi reports that a backend has crashed or stopped responding, do not immediately reinstall everything.

First, check the terminal from which Delphi was launched.

Look for errors involving:

```text
CUDA
Vulkan
ROCm
OpenVINO
Metal
glibc
DLLs
out of memory
```

The terminal usually contains the most useful information for identifying what went wrong.

You can also consult the **Troubleshooting & FAQ** section of this README for known problems and their solutions.

---

### 🚀 Recommended First-Time Path

If you are completely new to Delphi, the recommended order is:

```text
1. Launch Delphi
       ↓
2. Check hardware detection
       ↓
3. Install a small image model
       ↓
4. Generate your first image
       ↓
5. Install a GGUF language model
       ↓
6. Try local Text Chat
       ↓
7. Configure Whisper
       ↓
8. Configure Kokoro TTS
       ↓
9. Explore Model Manager
       ↓
10. Experiment with different models and backends
```

Once you are comfortable with the basic workflow, explore the **Hardware Compatibility**, **Building From Source**, and **Troubleshooting** sections for more advanced configuration.

---

## <a id="hardware-compatibility-acceleration"></a>🖥️ Hardware Compatibility & Acceleration

### Windows

| GPU Vendor | Tech | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Nvidia** | CUDA | ✅ Native | Maps `sd-cuda.exe` with Nvidia SDK 12 optimizations. |
| **AMD Radeon** | Vulkan | ✅ Native | Maps `sd-vulkan.exe` with Vulkan API acceleration. |
| **Intel Arc** | Vulkan | ✅ Native | Maps `sd-vulkan.exe` for Intel hardware. |
| **Integrated / None** | CPU | ⚠️ Fallback | Runs on logical CPU threads (slow). |

### Linux

| GPU Vendor | Primary | Fallback | Notes |
| :--- | :--- | :--- | :--- |
| **NVIDIA** | CUDA / Vulkan | Vulkan / CPU | Auto-detects NVIDIA. Prompt-driven CUDA setup downloads prebuilt or compiles from source. Falls back to Vulkan for GTX. |
| **AMD Radeon** | ROCm | Vulkan | ROCm provides best AMD performance when host ROCm drivers are available. |
| **Intel Arc / integrated** | Vulkan | CPU | Cross-vendor Vulkan support. |
| **Intel Core Ultra NPU** | OpenVINO NPU | CPU | Requires the Intel Linux NPU driver, kernel 6.6+, Python 3, and `./linux.sh --setup-openvino`. |
| **Integrated / None** | CPU | — | Runs on logical CPU threads (slow). |

### macOS

| Hardware | Primary | Fallback | Notes |
| :--- | :--- | :--- | :--- |
| **Apple Silicon (M1 or newer)** | Metal | CPU | Uses the official Darwin arm64 stable-diffusion.cpp backend. |

> [!IMPORTANT]
> **System Requirements & Notes:**
> - **64-bit Windows 10 or Windows 11** is required for the portable Node.js 22 runtime used by the Windows launcher.
> - **glibc 2.38 or newer** is required for the prebuilt Linux backends (Ubuntu 24.04, Fedora 40+, etc.). The setup script will warn you if your glibc is older.
> - **Linux runtime libraries:** The prebuilt backends require `libgomp.so.1`; Vulkan additionally requires `libvulkan.so.1` and a working GPU driver. The setup script now checks these before installing a backend and prints the exact distro package command when one is missing.
> - **Linux OpenVINO NPU:** Intel Core Ultra, x86_64 Linux, kernel 6.6+, a working `/dev/accel/accel0` device, Python 3 with `venv`, and the Intel Linux NPU driver are required.

---

## <a id="troubleshooting-faq"></a>🛠️ Troubleshooting & FAQ

<details>
  <summary><strong> Reset Environment: If a build fails or you want to clear dependencies</strong></summary>
  <p>Run <code>scripts/reset/reset.ps1</code> (Windows) or <code>scripts/reset/reset.sh</code> (Linux/macOS). This will clear temporary compilation and package caches to repair your environment. <em>(Note: This preserves your model weights and generated output images).</em></p>
</details>

<details>
  <summary><strong> Linux backends fail to start with <code>GLIBC_2.38 not found</code></strong></summary>
  <p>The prebuilt binaries require glibc 2.38+ (e.g. Ubuntu 24.04). If your distribution uses an older glibc version, you can upgrade your operating system or compile the backend from source (see the <a href="#building-from-source">Building From Source</a> guide below).</p>
</details>

<details>
  <summary><strong> Port Conflicts: Default port address already busy</strong></summary>
  <p>The web user interface runs on port <code>1420</code> by default. The GPU backend manager attempts to bind to port <code>8080</code> first, then automatically detects and falls back to a free system port if <code>8080</code> is already occupied.</p>
</details>

<details>
  <summary><strong> Linux ROCm not loading for AMD Radeon GPUs</strong></summary>
  <p>Ensure your AMD GPU hardware and host kernel are fully compatible with ROCm 7.13. If ROCm fails to initialize correctly, the application will automatically fall back to Vulkan acceleration.</p>
</details>

<details>
  <summary><strong> Linux uses the integrated GPU instead of the discrete GPU</strong></summary>
  <p>On dual-GPU Linux systems, Vulkan device order can put the integrated Intel GPU at <code>vulkan0</code> and the discrete AMD/NVIDIA GPU at <code>vulkan1</code>. The launcher now tries to prefer a discrete Vulkan device when <code>vulkaninfo --summary</code> is available. To force a device manually, start the app with <code>SD_VULKAN_DEVICE=vulkan1 ./linux.sh</code> or use another index such as <code>vulkan0</code>/<code>vulkan2</code>.</p>
</details>

<details>
  <summary><strong> Windows exits with code <code>3221225781</code> (0xC0000135)</strong></summary>
  <p>This code means Windows could not locate a required backend DLL:</p>
  <ul>
    <li><strong>For AMD/Intel Vulkan:</strong> Rerun <code>scripts/setup/setup.ps1</code>. Setup installs the required Microsoft Visual C++ x64 runtime and replaces stale Vulkan binaries with the compatible pinned build. Approve the Windows administrator prompt when it appears.</li>
    <li><strong>For NVIDIA CUDA:</strong> Install or update your NVIDIA graphics driver, then rerun the setup script to restore the CUDA runtime DLLs.</li>
  </ul>
  <p>If setup cannot install the runtime, install Microsoft's official <a href="https://aka.ms/vc14/vc_redist.x64.exe">Visual C++ Redistributable for x64</a> manually, restart Windows, and rerun setup. A custom Vulkan build is not the first fix for this exit code.</p>
</details>

<details>
  <summary><strong> Windows exits with code <code>3221225501</code> (0xC000001D)</strong></summary>
  <p>This is an illegal CPU instruction from an older machine-specific Windows backend build; it is not evidence that the model or RTX GPU is unsupported. Rerun <code>scripts/setup/setup.ps1</code> to replace the CPU/CUDA binaries with runtime-dispatched builds and install the matching CUDA 12.8 runtime. The corrected CUDA package includes Blackwell targets for RTX 50-series GPUs.</p>
</details>

<details>
  <summary><strong> Generation shows "server is not responding or crashed"</strong></summary>
  <p>This indicates that the local backend engine process terminated. Check your launch terminal (where you executed <code>windows.bat</code>, <code>./linux.sh</code>, or <code>./mac.sh</code>) for the exact console error. Common causes include glibc version mismatches, missing Vulkan drivers, or system out-of-memory (OOM) issues.</p>
</details>

---

## <a id="building-from-source"></a>🔨 Building From Source

The setup script (`scripts/setup/setup.sh`) now automates building and setting up the CUDA backend from source when selected. If you want to manually build all backends (CPU, Vulkan, and CUDA) at once, you can run the included `scripts/build/build_from_source.sh` script.

For macOS, the included `scripts/build/build_from_source.sh` builds the Metal backend and copies it to `app/backend/mac/sd`.

### Requirements
- `git`, `cmake`, `make` (or `ninja`), and a C++17 compiler (`g++` / `clang++`).
- For **CUDA**: the NVIDIA CUDA toolkit (`nvcc`) must be on your `PATH`.
- For **Vulkan**: the Vulkan SDK / loader, a compatible driver, and `glslc` (Ubuntu/Debian package: `glslc`).
- For **ROCm**: AMD ROCm development libraries.
- For **macOS Metal**: Apple Command Line Tools or Xcode.

### Build commands

```bash
# 1. Clone upstream
git clone https://github.com/leejet/stable-diffusion.cpp.git
cd stable-diffusion.cpp
mkdir build && cd build

# 2. Configure for your backend (pick ONE)
# CPU only
cmake .. -DSD_BUILD_SHARED_LIBS=ON -DCMAKE_BUILD_TYPE=Release

# CUDA
cmake .. -DSD_CUDA=ON -DSD_BUILD_SHARED_LIBS=ON -DCMAKE_BUILD_TYPE=Release

# Vulkan
cmake .. -DSD_VULKAN=ON -DSD_BUILD_SHARED_LIBS=ON -DCMAKE_BUILD_TYPE=Release

# ROCm
cmake .. -DSD_HIPBLAS=ON -DSD_BUILD_SHARED_LIBS=ON -DCMAKE_BUILD_TYPE=Release

# macOS Metal
cmake .. -DSD_METAL=ON -DSD_BUILD_SHARED_LIBS=ON -DCMAKE_BUILD_TYPE=Release

# 3. Build
cmake --build . --config Release -j$(getconf _NPROCESSORS_ONLN 2>/dev/null || sysctl -n hw.ncpu)

# 4. Copy the binaries into this project
cp bin/sd* /path/to/Delphi/app/backend/linux/<backend>/
```

After copying, rename the server binary to match what `scripts/server/serve.cjs` expects:
- Vulkan: `sd` → `sd-vulkan`
- ROCm: `sd` → `sd-rocm`

Then restart the app with `./linux.sh` (Linux) or `./mac.sh` (macOS).

---

## ❤️ Acknowledgements

Delphi would not exist in its current form without the work of **TechJarves** and the original **[Uncensored AI Studio](https://github.com/techjarves/Uncensored-Local-Studio)** project.

The original Uncensored AI Studio demonstrated how a unified, portable local AI environment could bring **image generation, local LLMs, speech-to-text, and text-to-speech** together behind a simple interface, while handling the difficult work of local runtimes, hardware acceleration, model management, and cross-platform support.

**Delphi is an independent reimplementation inspired by and built from studying that project.** The original project is preserved in this repository under `techJarvesOG` for reference and attribution, while Delphi represents my own ongoing development, changes, architectural decisions, and additions.

A sincere thank-you to **TechJarves** for creating the project that provided the foundation and inspiration for this work.

> **Original project:** [TechJarves — Uncensored AI Studio](https://github.com/techjarves/Uncensored-Local-Studio)
> **Original author:** TechJarves
> **License:** MIT

Please visit and support the original project if you find Delphi useful. The work that went into Uncensored AI Studio deserves recognition.

---

## <a id="licensing"></a>📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file. Bundles [stable-diffusion.cpp](https://github.com/leejet/stable-diffusion.cpp) (MIT License). Model weights are subject to their respective creators' licenses.
