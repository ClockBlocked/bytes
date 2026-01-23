window.AppAssets = {

///////////////////////////////////////////////////
////////////////////////////  I C O N S  //////////
/////////////////////////  Editor Options  ////////
icons: {
    file: () => `
  <svg class="header-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        width="32"
        height="32">
        
  <path fill="currentColor"
        d="M64 48l112 0 0 88c0 39.8 32.2 72 72 72l88 0 0 240c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16zM224 67.9l92.1 92.1-68.1 0c-13.3 0-24-10.7-24-24l0-68.1zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-261.5c0-17-6.7-33.3-18.7-45.3L242.7 18.7C230.7 6.7 214.5 0 197.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"/>

  </svg>
`,
    edit: () => `
  <svg class="buttonIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="14"
        height="14">
        
  <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"/>
        
  </svg>
`,
    view: () => `
  <svg class="buttonIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="14"
        height="14">
        
  <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.831.88 9.577.43 8.899a1.62 1.62 0 0 1 0-1.798c.45-.678-1.367-1.932-2.637-3.023C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.824.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z"/>
        
  </svg>
`,
    undo: () => `
  <svg class="buttonIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="14"
        height="14">
        
  <path d="M2.5 5.724V2.75a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h5a.75.75 0 0 1 0-1.5H3.534L6.41 4.086A5.25 5.25 0 1 1 2.75 10.25a.75.75 0 0 0-1.5 0A6.75 6.75 0 1 0 7.058 2.85L2.5 5.724Z"/>
        
  </svg>
`,
    redo: () => `
  <svg class="buttonIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="14"
        height="14">
        
  <path d="M13.5 5.724V2.75a.75.75 0 0 1 1.5 0v5a.75.75 0 0 1-.75.75h-5a.75.75 0 0 1 0-1.5h3.216L9.59 4.086A5.25 5.25 0 1 0 13.25 10.25a.75.75 0 0 1 1.5 0A6.75 6.75 0 1 1 8.942 2.85l4.558 2.874Z"/>
        
  </svg>
`,
    search: () => `
  <svg class="buttonIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="14"
        height="14">
        
  <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/>
        
  </svg>
`,
    wrap: () => `
  <svg class="buttonIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="14"
        height="14">
        
  <path d="M2.75 3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25Zm10.5-1.5a1.75 1.75 0 0 1 1.75 1.75v8.5A1.75 1.75 0 0 1 13.25 14H2.75A1.75 1.75 0 0 1 1 12.25v-8.5A1.75 1.75 0 0 1 2.75 2Zm-9.5 5h3.75a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1 0-1.5ZM3 9.75a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75Z"/>
        
  </svg>
`,
    copy: () => `
  <svg class="buttonIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="14"
        height="14">
        
  <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25ZM5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/>
        
  </svg>
`,
    download: () => `
  <svg class="buttonIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="14"
        height="14">
        
  <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Zm-1-6a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5A.75.75 0 0 1 1.75 8Z"/>
  <path d="M8 .75a.75.75 0 0 1 .75.75v6.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l1.72 1.72V1.5A.75.75 0 0 1 8 .75Z"/>
        
  </svg>
`,
    upload: () => `
  <svg class="buttonIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="14"
        height="14">
        
  <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z"/>
  <path d="M8.75 1.75V8.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l1.72 1.72V1.75a.75.75 0 0 1 1.5 0Z" transform="rotate(180 8 5.5)"/>
        
  </svg>
`,
    moon: () => `
  <svg class="buttonIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="14"
        height="14">
        
  <path d="M9.598 1.591a.749.749 0 0 1 .785-.175 7.001 7.001 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Z"/>
        
  </svg>
`,
    sun: () => `
  <svg class="buttonIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="14"
        height="14">
        
  <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm5.657-8.157a.75.75 0 0 1 0 1.061l-1.061 1.06a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.06-1.06a.75.75 0 0 1 1.06 0Zm-9.193 9.193a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 1 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.061 0ZM8 0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 8 0ZM3 8a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 3 8Zm13 0a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 16 8Zm-8 5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 13Zm3.536-1.464a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 0 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.061Zm-9.193-9.193a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 0 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.061Z"/>
        
  </svg>
`,
    fullscreen: () => `
  <svg class="buttonIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="14"
        height="14">
        
  <path d="M1.75 10a.75.75 0 0 1 .75.75v2.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 1 13.25v-2.5a.75.75 0 0 1 .75-.75Zm12.5 0a.75.75 0 0 1 .75.75v2.5A1.75 1.75 0 0 1 13.25 15h-2.5a.75.75 0 0 1 0-1.5h2.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 .75-.75ZM2.75 1a1.75 1.75 0 0 0-1.75 1.75v2.5a.75.75 0 0 0 1.5 0v-2.5a.25.25 0 0 1 .25-.25h2.5a.75.75 0 0 0 0-1.5Zm8 0a.75.75 0 0 0 0 1.5h2.5a.25.25 0 0 1 .25.25v2.5a.75.75 0 0 0 1.5 0v-2.5A1.75 1.75 0 0 0 13.25 1Z"/>
        
  </svg>
`,
    more: () => `
  <svg class="buttonIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="14"
        height="14">
        
  <path d="M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
        
  </svg>
`,
    code: (label) => `
  <svg class="badgeIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="12"
        height="12">
        
  <path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z"/>
        
  </svg>${label}
`,
    chevronDown: () => `
  <svg class="chevron"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        width="16"
        height="16">
        
  <path fill="currentColor" d="M207.5 103c9.4-9.4 24.6-9.4 33.9 0l200 200c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-183-183-183 183c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l200-200z"/>
        
  </svg>
`,
    chevron: () => `
  <svg class="chevronIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="12"
        height="12">
        
  <path d="M4.427 7.427l3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 10.896 2H4.604a.25.25 0 0 0-.177.427Z"/>
        
  </svg>
`,
    format: () => `
  <svg class="dropdownIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="14"
        height="14">
        
  <path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z"/>
        
  </svg>
`,
    fold: () => `
  <svg class="dropdownIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="14"
        height="14">
        
  <path d="M10.896 2H8.75V.75a.75.75 0 0 0-1.5 0V2H5.104a.25.25 0 0 0-.177.427l2.896 2.896a.25.25 0 0 0 .354 0l2.896-2.896A.25.25 0 0 0 10.896 2ZM8.75 15.25a.75.75 0 0 1-1.5 0V14H5.104a.25.25 0 0 1-.177-.427l2.896-2.896a.25.25 0 0 1 .354 0l2.896 2.896a.25.25 0 0 1-.177.427H8.75ZM9.78 7.22a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06L8.19 7.75 6.47 6.03a.75.75 0 0 1 1.06-1.06l2.25 2.25Z"/>
        
  </svg>
`,
    unfold: () => `
  <svg class="dropdownIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="14"
        height="14">
        
  <path d="M5.427 2.573a.25.25 0 0 1 .354 0l2.896 2.896a.25.25 0 0 1-.177.427H6.354v2.208a.75.75 0 0 1-1.5 0V5.896H2.75a.25.25 0 0 1-.177-.427l2.854-2.896Zm5.146 10.854a.25.25 0 0 1-.354 0l-2.896-2.896a.25.25 0 0 1 .177-.427h2.146V7.896a.75.75 0 0 1 1.5 0v2.208h2.104a.25.25 0 0 1 .177.427Z"/>
        
  </svg>
`,
    invisibles: () => `
  <svg class="dropdownIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="14"
        height="14">
        
  <path d="M2.75 3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25Zm10.5-1.5a1.75 1.75 0 0 1 1.75 1.75v8.5A1.75 1.75 0 0 1 13.25 13H2.75A1.75 1.75 0 0 1 1 12.25v-8.5A1.75 1.75 0 0 1 2.75 2Zm-9.5 5h3.75a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1 0-1.5ZM3 9.75a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75Z"/>
        
  </svg>
`,
    minus: () => `
  <svg class="tinyIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="12"
        height="12">
        
  <path d="M2 7.75A.75.75 0 0 1 2.75 7h10a.75.75 0 0 1 0 1.5h-10A.75.75 0 0 1 2 7.75Z"/>
        
  </svg>
`,
    plus: () => `
  <svg class="tinyIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="12"
        height="12">
        
  <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"/>
        
  </svg>
`,
    searchPrev: () => `
  <svg class="tinyIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="12"
        height="12">
        
  <path d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z"/>
        
  </svg>
`,
    searchNext: () => `
  <svg class="tinyIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="12"
        height="12">
        
  <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"/>
        
  </svg>
`,
    close: () => `
  <svg class="tinyIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="12"
        height="12">
        
  <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/>
        
  </svg>
`,
    statusOk: () => `
  <svg class="statusIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="14"
        height="14">
        
  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
        
  </svg>
`,
    clock: () => `
  <svg class="footerIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="12"
        height="12">
        
  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.556 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"/>
        
  </svg>
`,
    fileSize: () => `
  <svg class="footerIcon"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="12"
        height="12">
        
  <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h11a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 9.5Zm0 8a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 11.5Z"/>
        
  </svg>
`,

    arrowDown: () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 560">
  <!--! Font Awesome Pro 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2025 Fonticons, Inc. -->
  <path
    opacity=".4"
    fill="currentColor"
    d="M0 293.7c0-23 18.7-41.7 41.7-41.7l168.3 0 0 182c0 7.7 6.3 14 14 14s14-6.3 14-14l0-182 168.3 0c23 0 41.7 18.7 41.7 41.7 0 9.3-3.1 18.3-8.8 25.6l-170 218.6C258.3 551.8 241.7 560 224 560s-34.3-8.2-45.2-22.1L8.8 319.3C3.1 312 0 303 0 293.7z"
  />
  <path
    fill="currentColor"
    d="M224 448c7.7 0 14-6.3 14-14l0-420c0-7.7-6.3-14-14-14s-14 6.3-14 14l0 420c0 7.7 6.3 14 14 14z"
  />
</svg>
`,

///////////////////////////////////////////////////
/////////////////////////  File & Folder Icons  ///
///////////////////////////////////////////////////
    folder: () => `
  <svg class="w-4 h-4 text-github-accent-fg" fill="currentColor" viewBox="0 0 16 16">
    <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z"/>
  </svg>
`,
    fileCode: () => `
  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
  </svg>
`,
    trash: () => `
  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.748 1.748 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z"/>
  </svg>
`,
    cloudUpload: () => `
  <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.75.75 0 0 1 0-1.5h2.688c1.072 0 1.812-.727 1.812-1.727 0-.79-.576-1.557-1.542-1.729-.39-.068-.738-.378-.738-.773 0-2.267-1.95-4.02-4.22-4.02a4.03 4.03 0 0 0-2.615.993.75.75 0 0 1-.955.029c-.41-.3-.893-.462-1.38-.462-.91 0-1.637.676-1.707 1.524a.75.75 0 0 1-.617.678C2.217 4.213 1 5.344 1 6.75 1 8.293 2.363 9.5 4.02 9.5H6a.75.75 0 0 1 0 1.5H4.02C1.549 11 0 9.144 0 6.75c0-1.972 1.237-3.688 3.001-4.25a3.196 3.196 0 0 1 1.405-1.158Z"/>
    <path d="M8 6a.75.75 0 0 1 .75.75v5.19l1.72-1.72a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734l-3.25 3.25a.75.75 0 0 1-1.06 0l-3.25-3.25a.75.75 0 1 1 1.06-1.06l1.72 1.72V6.75A.75.75 0 0 1 8 6Z" transform="rotate(180 8 10)"/>
  </svg>
`,

///////////////////////////////////////////////////
/////////////////////////  Status & Notification  /
///////////////////////////////////////////////////
    success: () => `
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
  </svg>
`,
    error: () => `
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16ZM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646Z"/>
  </svg>
`,
    info: () => `
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
  </svg>
`,
    warning: () => `
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
  </svg>
`,

///////////////////////////////////////////////////
/////////////////////////  Navigation Icons  //////
///////////////////////////////////////////////////
    chevronRight: () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
    <path d="M6.22 13.72a.75.75 0 0 0 1.06 0l4.25-4.25a.75.75 0 0 0 0-1.06L7.28 4.22a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L9.94 8l-3.72 3.72a.75.75 0 0 0 0 1.06Z"/>
  </svg>
`,
    history: () => `
  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.556 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"/>
  </svg>
`,
    repo: () => `
  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/>
  </svg>
`,
    fileArchive: () => `
  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 16 16">
    <path d="M3.5 0H12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h-.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V0H4a.5.5 0 0 0 0 1h.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V1H8v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V1h.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V1H12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h.5Z"/>
  </svg>
`
},



///////////////////////////////////////////////////
//////////  V I E W E R  ///////  E D I T O R  ////
///////////////////////////////////////////////////
templates: {
  editor: () => `
<!-- H E A D E R -->
<div class="coderHeaderWrapper" id="stickyHeader">
  <button class="headerScrollBtn left" id="headerScrollLeft" title="Scroll left">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path
        d="M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06Z"
      />
    </svg>
  </button>

  <div class="coderHeader" id="coderHeader">
    <div class="headerScrollContainer" id="headerScrollContainer">
      <div class="headerContent">
<div class="leftSide">
  <div class="toolbarItem fileInfoGroup">
    <div class="fileNameContainer">
      <div class="fileNameInputWrapper">
        <svg class="fileIconInsideInput" viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
          <path d="M4 1.75C4 .784 4.784 0 5.75 0h5.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v8.586A1.75 1.75 0 0 1 14.25 15h-9a.75.75 0 0 1 0-1.5h9a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 10 4.25V1.5H5.75a.25.25 0 0 0-.25.25v2.5a.75.75 0 0 1-1.5 0v-2.5Zm7.5-.188V4.25c0 .138.112.25.25.25h2.688l-2.938-2.938ZM5.72 6.72a.75.75 0 0 0 0 1.06l1.47 1.47-1.47 1.47a.75.75 0 1 0 1.06 1.06l2-2a.75.75 0 0 0 0-1.06l-2-2a.75.75 0 0 0-1.06 0ZM3.28 7.78a.75.75 0 0 0-1.06-1.06l-2 2a.75.75 0 0 0 0 1.06l2 2a.75.75 0 0 0 1.06-1.06L1.81 9.25l1.47-1.47Z" />
        </svg>
        
        <input 
          type="text" 
          id="fileNameInput" 
          class="fileNameInput" 
          value="untitled" 
          spellcheck="false"
          placeholder="Enter file name"
          style="text-align: right;"
        />
      </div>
      
      <button id="fileExtensionBtn" class="fileExtensionBtn" title="Change file extension">
        <span id="fileExtensionLabel" class="fileExtensionLabel">.js</span>
        ${AppAssets.icons.arrowDown()}
      </button>
    </div>
    
    <span id="modifiedIndicator" class="modifiedIndicator hide" title="Modified">
      <span class="modifiedDot"></span>
    </span>
  </div>

  <div class="toolbarSeparator"></div>
</div>

        <div class="centerSide">
          <div class="modeButtons">
            <button id="editModeBtn" class="modeButton active" title="Edit Mode">
              ${AppAssets.icons.edit()}
              <span>Edit</span>
            </button>
            <button id="viewModeBtn" class="modeButton" title="View Mode">
              ${AppAssets.icons.view()}
              <span>View</span>
            </button>
          </div>
        </div>

        <div class="rightSide">
          <div class="actionButtons">

            <div class="toolbarSeparator"></div>

            <button id="themeBtn" class="headerButton" title="Toggle Theme">
              <svg id="themeIcon" class="buttonIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                ${AppAssets.icons.sun()}
              </svg>
            </button>

            <div class="toolbarSeparator"></div>

            <button id="fullscreenBtn" class="headerButton" title="Toggle Fullscreen">
              <svg
                id="fullscreenIcon"
                class="buttonIcon"
                viewBox="0 0 16 16"
                fill="currentColor"
                width="14"
                height="14"
              >
                ${AppAssets.icons.fullscreen()}
              </svg>
            </button>

            <button id="moreOptionsBtn" class="headerButton" title="More Options">${AppAssets.icons.more()}</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <button class="headerScrollBtn right" id="headerScrollRight" title="Scroll right">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path
        d="M6.22 12.78a.75.75 0 0 0 1.06 0l4.25-4.25a.75.75 0 0 0 0-1.06L7.28 3.22a.751.751 0 0 0-1.042-.018.751.751 0 0 0-.018 1.042L9.94 8l-3.72 3.72a.75.75 0 0 0 0 1.06Z"
      />
    </svg>
  </button>
</div>

<!-- T O O L B A R -->
<div class="coderToolBarWrapper" id="coderToolBarWrapper">
  <div class="coderToolBar" id="coderToolBar">
    <div class="toolbarGroup">
      <button id="undoBtn" class="headerButton" title="Undo (Ctrl+Z)">${AppAssets.icons.undo()}</button>
      <button id="redoBtn" class="headerButton" title="Redo (Ctrl+Y)">${AppAssets.icons.redo()}</button>
    </div>

    <div class="separator"></div>

    <div class="toolbarGroup">
      <button id="searchBtn" class="headerButton" title="Search (Ctrl+F)">
        ${AppAssets.icons.search()}
        <span>Search</span>
      </button>
    </div>

    <div class="separator"></div>

    <div class="toolbarGroup">
      <button id="copyBtn" class="headerButton" title="Copy Code">${AppAssets.icons.copy()}</button>
      <button id="downloadBtn" class="headerButton" title="Download File">${AppAssets.icons.download()}</button>
      <button id="uploadBtn" class="headerButton" title="Upload File">${AppAssets.icons.upload()}</button>
    </div>

    <div class="separator"></div>

    <div class="toolbarGroup">
      <div class="fontSizeControl">
        <button id="fontDecreaseBtn" class="fontBtn" title="Decrease Font Size">${AppAssets.icons.minus()}</button>
        <span id="fontSizeLabel" class="fontSizeLabel">14px</span>
        <button id="fontIncreaseBtn" class="fontBtn" title="Increase Font Size">${AppAssets.icons.plus()}</button>
      </div>
    </div>
  </div>
</div>

<!-- C O D E R -->
<div class="editorContainer" id="editorContainer">
  <div class="editorCard">
    <div id="editorBody" class="editorBody">
      <div id="loadingSpinner" class="loadingSpinner" data-active="false">
        <div class="spinnerContainer">
          <svg class="spinnerSvg" viewBox="0 0 50 50">
            <circle class="spinnerTrack" cx="25" cy="25" r="20"></circle>
            <circle class="spinnerHead" cx="25" cy="25" r="20"></circle>
          </svg>
        </div>
      </div>

      <div id="codeMirrorContainer" class="codeMirrorContainer"></div>

      <div id="searchPanel" class="searchPanel hide">
        <div class="searchContainer">
          <input
            type="text"
            id="searchInput"
            class="searchInput"
            placeholder="Search..."
            autocomplete="off"
            spellcheck="false"
          />
          <div class="searchActions">
            <span id="searchMatches" class="searchCount">0/0</span>
            <button id="searchPrevBtn" class="searchNavBtn" title="Previous">${AppAssets.icons.searchPrev()}</button>
            <button id="searchNextBtn" class="searchNavBtn" title="Next">${AppAssets.icons.searchNext()}</button>
            <button id="closeSearchBtn" class="searchNavBtn" title="Close">${AppAssets.icons.close()}</button>
          </div>
        </div>
      </div>
    </div>

    <div class="editorFooter">
      <div class="editorFooterLeft">
        <div class="footerItem">
          <span class="footerLabel">Ln</span>
          <span id="cursorLine" class="footerValue">1</span>
          <span class="footerLabel">,</span>
          <span class="footerLabel">Col</span>
          <span id="cursorCol" class="footerValue">1</span>
        </div>

        <div class="footerDivider"></div>

        <div class="footerItem">
          <span id="lineCount" class="footerValue">0</span>
          <span class="footerLabel">lines</span>
          <span class="footerBullet">•</span>
          <span id="charCount" class="footerValue">0</span>
          <span class="footerLabel">chars</span>
        </div>

        <div class="footerDivider"></div>

        <div class="footerItem">
          ${AppAssets.icons.fileSize()}
          <span id="fileSize" class="footerValue">0 B</span>
        </div>
      </div>

      <div class="editorFooterCenter">
        <div id="statusIndicator" class="statusIndicator statusOk">
          ${AppAssets.icons.statusOk()}
          <span>No Issues</span>
        </div>
      </div>

      <div class="editorFooterRight">
        <div class="footerItem">
          ${AppAssets.icons.clock()}
          <span id="lastSaved" class="footerValue">Never</span>
        </div>
        <div class="footerDivider"></div>
        <span class="footerBadge">UTF-8</span>
        <span class="footerBadge">LF</span>
        <span class="footerBadge">Spaces: 2</span>
        <span class="footerBadge footerBadgeAccent" id="languageBadgeSmall">JavaScript</span>
      </div>
    </div>

    <input
      type="file"
      id="fileUploadInput"
      class="hide"
      accept=".js,.jsx,.ts,.tsx,.py,.html,.css,.json,.md,.txt,.yml,.yaml,.xml,.sql,.sh,.rb,.go,.rs,.java,.cpp,.c,.h,.cs,.php,.swift"
    />
  </div>
  <!-- End of editorCard -->
</div>
<!-- End of editorContainer -->
`,

    commitDropdown: () => `
<div id="commitDropdown" class="dropdown-menu hide" role="menu">
  <div class="dropdown-header">
    ${AppAssets.icons.file()}
    <div class="save-info">
      <h4 class="save-title" id="popoverTitle">Add Commit & Save</h4>
      <p class="save-subtitle" id="popoverSubtitle">Enter a commit message before saving</p>
    </div>
  </div>
  <div class="commit-form">
    <div class="commit-input-group">
      <label for="commitMessage" class="commit-label">Commit Message</label>
      <textarea id="commitMessage" class="commit-textarea" placeholder="Describe what you changed..." rows="3"></textarea>
    </div>
    <div class="form-actions">
      <button id="commitCancelBtn" class="btn btn-secondary">Cancel</button>
      <button id="commitSaveBtn" class="btn btn-primary">Save Changes</button>
    </div>
  </div>
</div>`,

    newFileDropdown: () => `
<div id="newFileDropdown" class="dropdown-menu hide" role="menu">
  <div class="dropdown-header">
    ${AppAssets.icons.file()}
    <div class="save-info">
      <h4 class="save-title">New File</h4>
      <p class="save-subtitle">Choose where to create your new file</p>
    </div>
  </div>
  <div class="dropdown-content">
    <button id="newFileWithRepo" class="dropdown-item" data-action="new-file-with-repo">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8zM5 12.25v3.25a.25.25 0 0 0 .4.2l1.45-1.087a.25.25 0 0 1 .3 0L8.6 15.7a.25.25 0 0 0 .4-.2v-3.25a.25.25 0 0 0-.25-.25h-3.5a.25.25 0 0 0-.25.25z"/>
      </svg>
      With Repository
    </button>
    <button id="newFileWithoutRepo" class="dropdown-item" data-action="new-file-without-repo">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 15H3.75A1.75 1.75 0 0 1 2 13.25Zm1.75-.25a.25.25 0 0 0-.25.25v11.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V4.664a.25.25 0 0 0-.073-.177l-2.914-2.914a.25.25 0 0 0-.177-.073Zm.75 9.5a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Zm.75-3.25a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5Z"/>
      </svg>
      Without Repository
    </button>
  </div>
</div>`,

languageDropdown: () => `
<div id="languageDropdown" class="dropdown-menu hide" role="menu">
  <div class="dropdown-header">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h8v2H3v12h8v2H3c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm10 0h8c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm0 2v14h8V5h-8z"/>
    </svg>
    <div class="save-info">
      <h4 class="save-title">Select Language</h4>
      <p class="save-subtitle">Choose the programming language</p>
    </div>
  </div>
  <div class="dropdown-content" id="languageList"></div>
</div>`,

moreOptionsDropdown: () => `
<div id="moreOptionsDropdown" class="dropdown-menu hide" role="menu">
  <div class="dropdown-header">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
    <div class="save-info">
      <h4 class="save-title">More Options</h4>
      <p class="save-subtitle">Additional editor settings</p>
    </div>
  </div>
  <div class="dropdown-content">
    <button class="dropdown-item" id="formatBtn">
      <svg class="dropdown-icon" viewBox="0 0 16 16" width="16" height="16">
        <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.72a.75.75 0 0 1 0-1.06Z"/>
      </svg>
      Format Code
    </button>
    <button class="dropdown-item" id="foldAllBtn">
      <svg class="dropdown-icon" viewBox="0 0 16 16" width="16" height="16">
        <path d="M10.896 2H8.75V.75a.75.75 0 0 0-1.5 0V2H5.104a.25.25 0 0 0-.177.427l2.896 2.896a.25.25 0 0 0 .354 0l2.896-2.896A.25.25 0 0 0 10.896 2ZM8.75 15.25a.75.75 0 0 1-1.5 0V14H5.104a.25.25 0 0 1-.177-.427l2.896-2.896a.25.25 0 0 1 .354 0l2.896 2.896a.25.25 0 0 1-.177.427H8.75ZM9.78 7.22a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06L8.19 7.75 6.47 6.03a.75.75 0 0 1 1.06-1.06l2.25 2.25Z"/>
      </svg>
      Fold All
    </button>
    <button class="dropdown-item" id="unfoldAllBtn">
      <svg class="dropdown-icon" viewBox="0 0 16 16" width="16" height="16">
        <path d="M5.427 2.573a.25.25 0 0 1 .354 0l2.896 2.896a.25.25 0 0 1-.177.427H6.354v2.208a.75.75 0 0 1-1.5 0V5.896H2.75a.25.25 0 0 1-.177-.427l2.854-2.896Zm5.146 10.854a.25.25 0 0 1-.354 0l-2.896-2.896a.25.25 0 0 1 .177-.427h2.146V7.896a.75.75 0 0 1 1.5 0v2.208h2.104a.25.25 0 0 1 .177.427Z"/>
      </svg>
      Unfold All
    </button>
    <div class="dropdown-divider"></div>
    <button class="dropdown-item" id="showInvisiblesBtn">
      <svg class="dropdown-icon" viewBox="0 0 16 16" width="16" height="16">
        <path d="M2.75 3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25Zm10.5-1.5a1.75 1.75 0 0 1 1.75 1.75v8.5A1.75 1.75 0 0 1 13.25 13H2.75A1.75 1.75 0 0 1 1 12.25v-8.5A1.75 1.75 0 0 1 2.75 2Zm-9.5 5h3.75a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1 0-1.5ZM3 9.75a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75Z"/>
      </svg>
      Show Invisibles
    </button>
    <div class="dropdown-divider"></div>
    <button class="dropdown-item" id="wrapBtn">
      <svg class="dropdown-icon" viewBox="0 0 16 16" width="16" height="16">
        <path d="M2.75 3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25Zm10.5-1.5a1.75 1.75 0 0 1 1.75 1.75v8.5A1.75 1.75 0 0 1 13.25 13H2.75A1.75 1.75 0 0 1 1 12.25v-8.5A1.75 1.75 0 0 1 2.75 2Zm-9.5 5h3.75a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1 0-1.5ZM3 9.75a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75Z"/>
      </svg>
      Toggle Word Wrap
    </button>
  </div>
</div>`
  },

///////////////////////////////////////////////////
/////////////  M O D A L S  //////////////////////
///////////////////////////////////////////////////
modals: {
  // Search Modal Template (from search.js)
  searchModal: () => `
<div id="searchModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
  <div class="bg-github-canvas-default rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-github-border-default">
    <!-- Search Header -->
    <div class="bg-github-canvas-overlay border-b border-github-border-default p-4">
      <div class="flex items-center gap-3">
        ${AppAssets.icons.search()}
        <input 
          type="text" 
          id="searchInput" 
          placeholder="Search files, content, tags..." 
          class="flex-1 bg-github-canvas-inset text-github-fg-default px-4 py-2 rounded-md border border-github-border-default focus:outline-none focus:border-github-accent-emphasis"
        />
        <button onclick="hideSearchModal()" class="text-github-fg-muted hover:text-github-fg-default">
          ${AppAssets.icons.close()}
        </button>
      </div>
      <!-- Search Options -->
      <div class="mt-3 flex gap-3 flex-wrap">
        <label class="flex items-center gap-2 text-sm text-github-fg-default">
          <input type="checkbox" id="searchCaseSensitive" class="rounded">
          Case Sensitive
        </label>
        <label class="flex items-center gap-2 text-sm text-github-fg-default">
          <input type="checkbox" id="searchUseRegex" class="rounded">
          Regex
        </label>
        <label class="flex items-center gap-2 text-sm text-github-fg-default">
          <input type="checkbox" id="searchInContent" checked class="rounded">
          Content
        </label>
        <label class="flex items-center gap-2 text-sm text-github-fg-default">
          <input type="checkbox" id="searchInFilenames" checked class="rounded">
          Filenames
        </label>
        <select id="searchFilterLanguage" class="bg-github-canvas-inset text-github-fg-default px-3 py-1 rounded border border-github-border-default text-sm">
          <option value="">All Languages</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="HTML">HTML</option>
          <option value="CSS">CSS</option>
          <option value="JSON">JSON</option>
          <option value="Markdown">Markdown</option>
        </select>
      </div>
    </div>
    <!-- Search Results -->
    <div id="searchResults" class="overflow-y-auto max-h-[60vh] p-4"></div>
  </div>
</div>`,

  // Import Modal Template (from importExport.js)
  importModal: () => `
<div id="importModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
  <div class="bg-github-canvas-default rounded-lg shadow-2xl w-full max-w-2xl border border-github-border-default">
    <div class="flex items-center justify-between p-6 border-b border-github-border-default">
      <h2 class="text-xl font-semibold text-github-fg-default">
        ${AppAssets.icons.download()}
        <span class="ml-2">Import from URL</span>
      </h2>
      <button onclick="hideImportModal()" class="text-github-fg-muted hover:text-github-fg-default">
        ${AppAssets.icons.close()}
      </button>
    </div>
    <div class="p-6">
      <div class="mb-4">
        <label class="block text-sm font-semibold text-github-fg-default mb-2">
          GitHub/GitLab/Bitbucket URL
        </label>
        <input 
          type="url" 
          id="importUrlInput" 
          placeholder="https://github.com/user/repo/blob/main/file.js"
          class="w-full bg-github-canvas-inset text-github-fg-default px-4 py-3 rounded-md border border-github-border-default focus:outline-none focus:border-github-accent-emphasis"
        />
        <p class="text-xs text-github-fg-muted mt-2">
          ${AppAssets.icons.info()}
          Paste a direct link to a file from GitHub, GitLab, or Bitbucket
        </p>
      </div>
      <div class="bg-github-canvas-inset rounded-lg p-4 mb-4">
        <p class="text-sm font-semibold text-github-fg-default mb-2">Examples:</p>
        <ul class="text-xs text-github-fg-muted space-y-1 font-mono">
          <li>• https://github.com/user/repo/blob/main/src/index.js</li>
          <li>• https://gitlab.com/user/repo/-/blob/main/config.json</li>
          <li>• https://raw.githubusercontent.com/user/repo/main/file.md</li>
        </ul>
      </div>
      <div class="flex gap-3">
        <button 
          onclick="performImport()" 
          class="flex-1 bg-github-success-emphasis text-white px-6 py-3 rounded-lg hover:bg-github-success-fg transition-all font-semibold"
        >
          ${AppAssets.icons.download()}
          <span class="ml-2">Import File</span>
        </button>
        <button 
          onclick="hideImportModal()" 
          class="px-6 py-3 border border-github-border-default rounded-lg hover:bg-github-canvas-overlay transition-all text-github-fg-default"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</div>`,

  // Export Modal Template (from importExport.js)
  exportModal: () => `
<div id="exportModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
  <div class="bg-github-canvas-default rounded-lg shadow-2xl w-full max-w-md border border-github-border-default">
    <div class="flex items-center justify-between p-6 border-b border-github-border-default">
      <h2 class="text-xl font-semibold text-github-fg-default">
        ${AppAssets.icons.upload()}
        <span class="ml-2">Export Repository</span>
      </h2>
      <button onclick="hideExportModal()" class="text-github-fg-muted hover:text-github-fg-default">
        ${AppAssets.icons.close()}
      </button>
    </div>
    <div class="p-6">
      <p class="text-github-fg-muted mb-4">
        Export <span id="exportRepoName" class="font-semibold text-github-fg-default"></span>
      </p>
      <div class="space-y-3">
        <button 
          onclick="exportRepositoryAsZip()" 
          class="w-full bg-github-canvas-overlay border border-github-border-default px-6 py-4 rounded-lg hover:border-github-accent-emphasis transition-all text-left"
        >
          <div class="flex items-center">
            ${AppAssets.icons.fileArchive()}
            <div class="ml-4">
              <div class="font-semibold text-github-fg-default">ZIP Archive</div>
              <div class="text-sm text-github-fg-muted">Download as .zip file</div>
            </div>
          </div>
        </button>
        <button 
          onclick="exportRepositoryAsJson()" 
          class="w-full bg-github-canvas-overlay border border-github-border-default px-6 py-4 rounded-lg hover:border-github-accent-emphasis transition-all text-left"
        >
          <div class="flex items-center">
            ${AppAssets.icons.code('')}
            <div class="ml-4">
              <div class="font-semibold text-github-fg-default">JSON Export</div>
              <div class="text-sm text-github-fg-muted">Export as .json file</div>
            </div>
          </div>
        </button>
      </div>
      <button 
        onclick="hideExportModal()" 
        class="w-full mt-4 px-6 py-3 border border-github-border-default rounded-lg hover:bg-github-canvas-overlay transition-all text-github-fg-default"
      >
        Cancel
      </button>
    </div>
  </div>
</div>`,

  // Upload Modal Template (from fileUpload.js)
  uploadModal: () => `
<div id="uploadModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
  <div class="bg-github-canvas-default rounded-lg shadow-2xl w-full max-w-2xl border border-github-border-default">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b border-github-border-default">
      <h2 class="text-xl font-semibold text-github-fg-default">
        ${AppAssets.icons.upload()}
        <span class="ml-2">Upload Files</span>
      </h2>
      <button onclick="hideUploadModal()" class="text-github-fg-muted hover:text-github-fg-default">
        ${AppAssets.icons.close()}
      </button>
    </div>
    <!-- Body -->
    <div class="p-6">
      <!-- Drag & Drop Zone -->
      <div 
        id="uploadDropZone" 
        data-drop-zone
        class="border-2 border-dashed border-github-border-default rounded-lg p-12 text-center hover:border-github-accent-emphasis transition-all cursor-pointer"
        onclick="document.getElementById('fileInput').click()"
      >
        ${AppAssets.icons.cloudUpload()}
        <p class="text-github-fg-default font-semibold mb-2 mt-4">
          Drag & drop files here
        </p>
        <p class="text-github-fg-muted text-sm mb-4">or</p>
        <button class="bg-github-success-emphasis text-white px-6 py-2 rounded-lg hover:bg-github-success-fg transition-all">
          ${AppAssets.icons.folder()}
          <span class="ml-2">Browse Files</span>
        </button>
        <p class="text-github-fg-muted text-xs mt-4">
          Supported: Text files, code files (max 10MB each)
        </p>
      </div>
      <!-- Hidden file input -->
      <input 
        type="file" 
        id="fileInput" 
        multiple 
        accept=".txt,.js,.jsx,.ts,.tsx,.html,.css,.scss,.json,.md,.py,.java,.php,.rb,.go,.rs,.xml,.yml,.yaml"
        class="hidden"
        onchange="handleFileInputChange(this)"
      />
      <!-- Upload to path info -->
      <div class="mt-4 p-4 bg-github-canvas-inset rounded-lg">
        <p class="text-sm text-github-fg-muted">
          ${AppAssets.icons.info()}
          Files will be uploaded to: 
          <span class="text-github-accent-fg font-mono" id="uploadPath"></span>
        </p>
      </div>
    </div>
  </div>
</div>`,

  // Preview Modal Template (from fileMenu.js)
  previewModal: (fileName, content) => `
<div id="previewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-github-canvas-default rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-github-border-default">
    <div class="flex items-center justify-between p-4 border-b border-github-border-default">
      <h3 class="text-lg font-semibold text-github-fg-default">
        ${AppAssets.icons.view()}
        <span class="ml-2">Preview: ${fileName}</span>
      </h3>
      <button onclick="closePreviewModal()" class="text-github-fg-muted hover:text-github-fg-default">
        ${AppAssets.icons.close()}
      </button>
    </div>
    <div class="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
      ${content}
    </div>
  </div>
</div>`,

  // Properties Modal Template (from fileMenu.js)
  propertiesModal: (fileName, props) => `
<div id="propsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-github-canvas-default rounded-lg shadow-2xl w-full max-w-md border border-github-border-default">
    <div class="flex items-center justify-between p-4 border-b border-github-border-default">
      <h3 class="text-lg font-semibold text-github-fg-default">
        ${AppAssets.icons.info()}
        <span class="ml-2">File Properties</span>
      </h3>
      <button onclick="closePropsModal()" class="text-github-fg-muted hover:text-github-fg-default">
        ${AppAssets.icons.close()}
      </button>
    </div>
    <div class="p-6 text-github-fg-default text-sm">
      ${props}
    </div>
    <div class="p-4 border-t border-github-border-default">
      <button onclick="closePropsModal()" class="w-full bg-github-success-emphasis text-white px-4 py-2 rounded-lg hover:bg-github-success-fg">
        Close
      </button>
    </div>
  </div>
</div>`
},

///////////////////////////////////////////////////
/////////////  C O M P O N E N T S  //////////////
///////////////////////////////////////////////////
components: {
  // File Menu Popover (from fileMenu.js)
  fileMenuPopover: (fileName, isFile = true) => `
<div class="file-menu-header">
  ${AppAssets.icons.fileCode()}
  <span>${fileName}</span>
</div>
<div class="file-menu-divider"></div>
<div class="file-menu-items">
  ${isFile ? `
    <button class="file-menu-item" onclick="fileMenuManager.previewFile('${fileName}')">
      ${AppAssets.icons.view()}
      <span>Preview</span>
      <span class="file-menu-shortcut">Ctrl+P</span>
    </button>
    <button class="file-menu-item" onclick="fileMenuManager.editFileAction('${fileName}')">
      ${AppAssets.icons.edit()}
      <span>Edit</span>
      <span class="file-menu-shortcut">Ctrl+E</span>
    </button>
    <button class="file-menu-item" onclick="fileMenuManager.downloadFile('${fileName}')">
      ${AppAssets.icons.download()}
      <span>Download</span>
      <span class="file-menu-shortcut">Ctrl+D</span>
    </button>
    <div class="file-menu-divider"></div>
    <button class="file-menu-item" onclick="fileMenuManager.duplicateFile('${fileName}')">
      ${AppAssets.icons.copy()}
      <span>Duplicate</span>
    </button>
    <button class="file-menu-item" onclick="fileMenuManager.renameFile('${fileName}')">
      ${AppAssets.icons.edit()}
      <span>Rename</span>
      <span class="file-menu-shortcut">F2</span>
    </button>
    <button class="file-menu-item" onclick="fileMenuManager.moveFile('${fileName}')">
      ${AppAssets.icons.folder()}
      <span>Move to...</span>
    </button>
    <div class="file-menu-divider"></div>
    <button class="file-menu-item" onclick="fileMenuManager.fileProperties('${fileName}')">
      ${AppAssets.icons.info()}
      <span>Properties</span>
    </button>
    <div class="file-menu-divider"></div>
    <button class="file-menu-item danger" onclick="fileMenuManager.deleteFileAction('${fileName}')">
      ${AppAssets.icons.trash()}
      <span>Delete</span>
      <span class="file-menu-shortcut">Del</span>
    </button>
  ` : `
    <button class="file-menu-item" onclick="fileMenuManager.openFolder('${fileName}')">
      ${AppAssets.icons.folder()}
      <span>Open Folder</span>
    </button>
    <button class="file-menu-item" onclick="fileMenuManager.renameFile('${fileName}')">
      ${AppAssets.icons.edit()}
      <span>Rename</span>
    </button>
    <div class="file-menu-divider"></div>
    <button class="file-menu-item danger" onclick="fileMenuManager.deleteFolder('${fileName}')">
      ${AppAssets.icons.trash()}
      <span>Delete Folder</span>
    </button>
  `}
</div>`,

  // Success Notification (from overlays.js)
  successNotification: (message) => `
<div class="flex items-center space-x-2">
  ${AppAssets.icons.success()}
  <span>${message}</span>
</div>`,

  // Error Notification (from overlays.js)
  errorNotification: (message) => `
<div class="flex items-center space-x-2">
  ${AppAssets.icons.error()}
  <span>${message}</span>
</div>`,

  // Info Notification (from listeners.js)
  infoNotification: (message, type = 'info') => {
    const iconMap = {
      success: AppAssets.icons.success(),
      error: AppAssets.icons.error(),
      info: AppAssets.icons.info()
    };
    return `
<div class="flex items-center space-x-3">
  ${iconMap[type] || iconMap.info}
  <span class="text-github-fg-default text-sm">${message}</span>
</div>`;
  },

  // Selected Tag (from pageUpdates.js)
  selectedTag: (tag) => `
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-github-accent-emphasis/20 border border-github-accent-emphasis/30 text-github-accent-fg">
  ${tag}
  <button onclick="removeTag('${tag}')" class="ml-1.5 w-3.5 h-3.5 rounded-full hover:bg-github-accent-emphasis/30 flex items-center justify-center">
    ${AppAssets.icons.close()}
  </button>
</span>`,

  // Breadcrumb Nav Divider (from pageUpdates.js)
  breadcrumbDivider: () => `
<div class="navDivider" aria-hidden="true">
  ${AppAssets.icons.chevronRight()}
</div>`,

  // Breadcrumb Item (from pageUpdates.js)
  breadcrumbItem: (text, navigatePath = null, isCurrent = false) => `
<span 
  ${navigatePath ? `data-navigate-path="${navigatePath}"` : ''} 
  class="breadCrumb ${isCurrent ? 'current' : ''}">
  ${text}
</span>`,

  // Search Result Item (from search.js)
  searchResultItem: (result) => `
<div class="bg-github-canvas-overlay border border-github-border-default rounded-lg p-4 hover:border-github-accent-emphasis cursor-pointer transition-all" onclick="openSearchResult('${result.repository}', '${result.path}')">
  <div class="flex items-start justify-between">
    <div class="flex-1">
      <div class="flex items-center gap-2 mb-2">
        ${AppAssets.icons.fileCode()}
        <span class="font-semibold text-github-fg-default">${result.fileName}</span>
        <span class="text-xs text-github-fg-muted">${result.repository}</span>
      </div>
      <div class="text-xs text-github-fg-muted mb-2">${result.path}</div>
    </div>
  </div>
</div>`,

  // Empty Repository State (from pageUpdates.js)
  emptyRepoState: () => `
<div class="col-span-full text-center py-12">
  ${AppAssets.icons.repo()}
  <h3 class="text-lg font-medium text-github-fg-default mb-2">No repositories yet</h3>
  <p class="text-github-fg-muted mb-4">Create your first repository to get started</p>
  <button onclick="showCreateRepoModal()" class="inline-flex items-center px-4 py-2 bg-github-btn-primary-bg hover:bg-github-btn-primary-hover text-white rounded-md text-sm font-medium transition-colors">
    ${AppAssets.icons.plus()}
    <span class="ml-2">Create repository</span>
  </button>
</div>`,

  // Empty Files State (from pageUpdates.js)
  emptyFilesState: () => `
<tr>
  <td colspan="4" class="px-4 py-8 text-center text-github-fg-muted">
    ${AppAssets.icons.repo()}
    <p>No files in this directory</p>
    <button onclick="showCreateFileModal()" class="mt-2 text-github-accent-fg hover:underline text-sm">
      Create your first file
    </button>
  </td>
</tr>`,

  // Loading State (from pageUpdates.js)
  loadingState: () => `
<tr>
  <td colspan="4" class="px-4 py-8 text-center text-github-fg-muted">
    <div class="animate-pulse">Loading files...</div>
  </td>
</tr>`,

  // Error State (from pageUpdates.js)
  errorState: (message) => `
<tr>
  <td colspan="4" class="px-4 py-8 text-center text-github-fg-muted text-red-500">
    ${AppAssets.icons.warning()}
    <p>Error loading files</p>
    <p class="text-sm mt-1">${message}</p>
    <button onclick="renderFileList()" class="mt-2 text-github-accent-fg hover:underline text-sm">
      Retry
    </button>
  </td>
</tr>`,

  // Search History Empty State (from search.js)
  searchHistoryEmpty: () => `
<div class="text-center py-12 text-github-fg-muted">
  ${AppAssets.icons.history()}
  <p class="mt-4">No search history</p>
</div>`,

  // Search No Results State (from search.js)
  searchNoResults: (query) => `
<div class="text-center py-12 text-github-fg-muted">
  ${AppAssets.icons.search()}
  <p class="mt-4">No results found for "${query}"</p>
</div>`,

  // Recent File Item (from pageUpdates.js)
  recentFileItem: (file) => `
<button onclick="openRecentFile('${file.repoName}', '${file.filePath}', '${file.fileName}')" 
        class="w-full flex items-center justify-between p-2 rounded hover:bg-github-canvas-subtle text-left group">
  <div class="flex-1 min-w-0">
    <div class="flex items-center space-x-2">
      ${AppAssets.icons.fileCode()}
      <span class="text-sm text-github-fg-default truncate">${file.fileName}</span>
    </div>
    <div class="text-xs text-github-fg-muted truncate mt-1">${file.repoName}</div>
  </div>
  ${AppAssets.icons.chevronRight()}
</button>`
}
};
