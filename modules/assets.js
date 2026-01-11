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
`
},



///////////////////////////////////////////////////
//////////  V I E W E R  ///////  E D I T O R  ////
///////////////////////////////////////////////////
templates: {

  editor: () => `
<div class="coderToolBarWrapper">
  <div class="coderToolBar">
    <div class="grouped">
      <button id="editModeBtn" class="headerButton active" title="Edit Mode">${AppAssets.icons.edit()}</button>

      <button id="viewModeBtn" class="headerButton" title="View Mode">${AppAssets.icons.view()}</button>

      <button id="themeBtn" class="headerButton" title="Toggle Theme">
        <svg id="themeIcon" class="buttonIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
          ${AppAssets.icons.sun()}
        </svg>
      </button>
    </div>


<div class="separator"></div>


    <div class="hGroup">
      <button id="undoBtn" class="headerButton" title="Undo (Ctrl+Z)">${AppAssets.icons.undo()}</button>
      <button id="redoBtn" class="headerButton" title="Redo (Ctrl+Y)">${AppAssets.icons.redo()}</button>
    </div>


<div class="separator"></div>


    <div class="grouped">
      <button id="searchBtn" class="headerButton" title="Search (Ctrl+F)">
        ${AppAssets.icons.search()} Search Code
      </button>
    </div>

    <div class="grouped">
      <button id="wrapBtn" class="headerButton" title="Toggle Word Wrap">${AppAssets.icons.wrap()}</button>

      <button id="fullscreenBtn" class="headerButton" title="Toggle Fullscreen">
        <svg id="fullscreenIcon" class="buttonIcon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
          ${AppAssets.icons.fullscreen()}
        </svg>
      </button>
    </div>


<div class="separator"></div>


    <div class="hGroup">
      <button id="copyBtn" class="headerButton" title="Copy Code">${AppAssets.icons.copy()}</button>

      <button id="downloadBtn" class="headerButton" title="Download File">${AppAssets.icons.download()}</button>

      <button id="uploadBtn" class="headerButton" title="Upload File">${AppAssets.icons.upload()}</button>
    </div>

    <div class="grouped">
      <div class="fontSizeControl">
        <button id="fontDecreaseBtn" class="fontBtn" title="Decrease Font Size">${AppAssets.icons.minus()}</button>

        <span id="fontSizeLabel" class="fontSizeLabel">14px</span>

        <button id="fontIncreaseBtn" class="fontBtn" title="Increase Font Size">${AppAssets.icons.plus()}</button>
      </div>
    </div>

    <div class="grouped">
      <button id="moreOptionsBtn" class="headerButton" title="More Options">${AppAssets.icons.more()}</button>
    </div>
  </div>
</div><!-- Wrapper -->  
  




<div class="editorContainer">

  <div class="editorCard">
    <div class="coderHeaderWrapper" id="stickyHeader">
    <div class="coderHeader">
    
      <div class="leftSide">
        <div class="toolbarItem">
          <svg class="toolbarIcon" viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
            <path
              d="M4 1.75C4 .784 4.784 0 5.75 0h5.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v8.586A1.75 1.75 0 0 1 14.25 15h-9a.75.75 0 0 1 0-1.5h9a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 10 4.25V1.5H5.75a.25.25 0 0 0-.25.25v2.5a.75.75 0 0 1-1.5 0v-2.5Zm7.5-.188V4.25c0 .138.112.25.25.25h2.688l-2.938-2.938ZM5.72 6.72a.75.75 0 0 0 0 1.06l1.47 1.47-1.47 1.47a.75.75 0 1 0 1.06 1.06l2-2a.75.75 0 0 0 0-1.06l-2-2a.75.75 0 0 0-1.06 0ZM3.28 7.78a.75.75 0 0 0-1.06-1.06l-2 2a.75.75 0 0 0 0 1.06l2 2a.75.75 0 0 0 1.06-1.06L1.81 9.25l1.47-1.47Z"
            />
          </svg>
          <span id="fileNameDisplay" class="fileName">untitled.js</span>
          <span id="modifiedBadge" class="badge badgeSecondary hide">Modified</span>
        </div>
        
        
<div class="toolbarSeparator"></div>
        
        
        <div class="languageSelector">
          <button id="languageBtn" class="toolbarButton languageBtn">
            ${AppAssets.icons.code("")}
            <span id="languageLabel">JavaScript</span>
            ${AppAssets.icons.chevron()}
          </button>
          <div id="languageDropdown" class="dropdown hide">
            <div class="dropdownContent" id="languageList"></div>
          </div>
        </div>
      </div>
      <div class="rightSide">
        <div class="dropdown-trigger">
          <button id="editSaveButton" class="trigger-button" aria-haspopup="true" aria-expanded="false">
            <span id="editSaveLabel">Edit</span>
            <span class="btn-divider">|</span>
            <span class="more-btn"> ${AppAssets.icons.chevronDown()} </span>
          </button>
        </div>
      </div>
    </div>

    <div id="moreOptionsDropdown" class="dropdown2 hide">
      <div class="dropdownContent">
        <button class="dropdownItem" id="formatBtn">${AppAssets.icons.format()} Format Document</button>
        <button class="dropdownItem" id="foldAllBtn">${AppAssets.icons.fold()} Fold All</button>
        <button class="dropdownItem" id="unfoldAllBtn">${AppAssets.icons.unfold()} Unfold All</button>
        <div class="dropdownDivider"></div>
        <button class="dropdownItem" id="showInvisiblesBtn">${AppAssets.icons.invisibles()} Show Invisibles</button>
      </div>
    </div>
    <!-- More Menu E N D -->

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
        <span id="languageBadge" class="footerBadge footerBadgeAccent"></span>
      </div>
    </div>
  </div>
  <input
    type="file"
    id="fileUploadInput"
    class="hide"
    accept=".js,.jsx,.ts,.tsx,.py,.html,.css,.json,.md,.txt,.yml,.yaml,.xml,.sql,.sh,.rb,.go,.rs,.java,.cpp,.c,.h,.cs,.php,.swift"
  />
</div>


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
      <textarea
        id="commitMessage"
        class="commit-textarea"
        placeholder="Describe what you changed..."
        rows="3"
      ></textarea>
    </div>
    <div class="form-actions">
      <button id="commitCancelBtn" class="btn btn-secondary">Cancel</button>
      <button id="commitSaveBtn" class="btn btn-primary">Save Changes</button>
    </div>
  </div>
</div>`
    }
};
