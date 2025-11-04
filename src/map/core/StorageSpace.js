class StorageControl {
  constructor(getStorage) {
    this.getStorage = getStorage;
  }

  onAdd(map) {
    this.map = map;

    this.button = document.createElement('button');
    this.button.className = 'maplibregl-ctrl-icon';
    this.button.type = 'button';
    this.button.style.padding = "6px";
    this.button.style.fontSize = "15px";
    this.button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 6h18l-2 8H5L3 6zm2 10h14v2H5v-2z" />
      </svg>
    `;

    this.button.addEventListener("mouseenter", () => this.showPopup());
    this.button.addEventListener("mouseleave", () => this.hidePopup());

    this.container = document.createElement('div');
    this.container.className = 'maplibregl-ctrl-group maplibregl-ctrl';
    this.container.style.position = "relative";
    this.container.appendChild(this.button);

    this.popup = document.createElement('div');
    this.popup.style.display = "none";
    this.popup.style.position = "absolute";
    this.popup.style.right = "110%";
    this.popup.style.top = "50%";
    this.popup.style.transform = "translateY(-50%)";
    this.popup.style.background = "#fff";
    this.popup.style.padding = "14px 18px";
    this.popup.style.borderRadius = "10px";
    this.popup.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.25)";
    this.popup.style.fontSize = "13px";
    this.popup.style.zIndex = "9999";
    this.popup.style.minWidth = "160px";
    this.popup.style.opacity = "0";
    this.popup.style.transition = "opacity 0.25s ease";
    this.popup.style.textAlign = "center";

    this.container.appendChild(this.popup);

    return this.container;
  }

  onRemove() {
    this.container.remove();
  }

  async showPopup() {
    const { percent } = await this.getStorage();

    const color =
      percent > 80 ? "#d32f2f" :
      percent > 50 ? "#ed6c02" :
                     "#1976d2"; 

    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    this.popup.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 10px; color: #1976d2;">
        Storage Usage
      </div>

      <div style="display: flex; justify-content: center;">
        <svg width="80" height="80">
          <circle cx="40" cy="40" r="${radius}" stroke="#E5EAF2" stroke-width="6" fill="none"></circle>
          <circle
            cx="40" cy="40" r="${radius}"
            stroke="${color}"
            stroke-width="6"
            fill="none"
            stroke-linecap="round"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${offset}"
            style="transition: stroke-dashoffset 0.4s ease;"
          ></circle>
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="14" fill="${color}" font-weight="600">
            ${percent}%
          </text>
        </svg>
      </div>
    `;

    this.popup.style.display = "block";
    setTimeout(() => this.popup.style.opacity = "1", 10);
  }

  hidePopup() {
    this.popup.style.opacity = "0";
    setTimeout(() => this.popup.style.display = "none", 200);
  }
}

export default StorageControl;