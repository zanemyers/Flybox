## ⚙️ WebStorm Setup

### 🐞 Debugging

#### 1. Add a Debug Configuration

1. Open **Run/Debug Configurations** in WebStorm
2. Click **+ (Add New Configuration)**
3. Select **Attach to Node.js/Chrome**
4. Set the **Name** to `Debugger`
5. Set the **Port** to `9229`
6. Click **Apply** and **OK**

#### 2. Start the Server

- 🐳 **Docker**: `just start`
- 🏠 **Local**: `just start -l`

#### 3. Attach the Debugger

- Click the `🐞 (Debug)` button to run in debug mode


### 🧰 Recommended Extensions

- GitHub by JetBrains
- Just by linux_china
- Light Sheet by Victoryil (_may not work for newer versions of WebStorm_)
  > WebStorm bundles some plugins like Docker automatically

## ⚙️ Visual Studio Code Setup

### 🐞 Debugging

#### 1. Start the Server

- 🐳 **Docker**: `just start`
- 🏠 **Local**: `just start -l`

#### 2. Attach the Debugger

1. Open the **Run and Debug** tab (`Cmd + Shift + D` / `Ctrl + Shift + D`).
2. From the dropdown, select **Debugger**.
3. Click the **⏵ Run and Debug** button or press **F5**

### 🧰 Recommended Extensions

- Container Tools by Microsoft
- Docker by Microsoft
- Docker DX by Docker
- Excel Viewer by MESCIUS
- GitHub Copilot by GitHub
- Github Copilot Chat by Github
- Live Sass Compiler by Glenn Marks
- Prettier - Code formatter by Prettier
