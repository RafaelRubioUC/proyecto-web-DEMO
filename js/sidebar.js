// Datos del menú de la barra lateral
const menuItems = [
  {
    id: "dashboard",
    text: "Dashboard",
    icon: "home",
    link: "#",
    isActive: true,
  },
  {
    id: "transactions",
    text: "Transactions",
    icon: "dollar-sign",
    link: "#",
    isActive: false,
  },
  {
    id: "budget",
    text: "Budget",
    icon: "pie-chart",
    link: "#",
    isActive: false,
  },
  {
    id: "reports",
    text: "Reports",
    icon: "trending-up",
    link: "#",
    isActive: false,
  },
  {
    id: "settings",
    text: "Settings",
    icon: "settings",
    link: "#",
    isActive: false,
  },
];

// Función para crear un elemento del menú
function createMenuItem(item) {
  return `
        <a href="${item.link}" 
           id="${item.id}" 
           class="flex items-center space-x-3 p-3 rounded-lg ${
             item.isActive ? "active-nav-item" : "hover:bg-gray-100"
           }">
            <i data-feather="${item.icon}"></i>
            <span>${item.text}</span>
        </a>
    `;
}

// Función para generar la barra lateral completa
function generateSidebar() {
  const sidebarHTML = `
        <div class="sidebar w-64 bg-white border-r border-gray-200 flex flex-col">
            <div class="p-4 border-b border-gray-200">
                <div class="text-2xl font-bold">
                    Green<span class="text-green-500">Ledger</span>
                </div>
            </div>
            <nav class="flex-1 p-4 space-y-2">
                ${menuItems.map((item) => createMenuItem(item)).join("")}
            </nav>
            <div class="p-4 border-t border-gray-200 relative">
                <div id="accountButton" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                        <i data-feather="user" class="w-4 h-4"></i>
                    </div>
                    <span>Account</span>
                </div>
                <!-- El menú de la cuenta se cargará aquí -->
                <div id="accountMenuContainer" class="absolute bottom-full left-0 mb-2 hidden"></div>
            </div>
        </div>
    `;

  return sidebarHTML;
}

// Función para inicializar la barra lateral
function initializeSidebar() {
  // Encuentra el esqueleto de la barra lateral
  const skeleton = document.querySelector(".sidebar-skeleton");
  if (skeleton) {
    // Crea el nuevo elemento de la barra lateral
    const sidebarElement = document.createElement("div");
    sidebarElement.innerHTML = generateSidebar();

    // Reemplaza el esqueleto con la barra lateral real
    skeleton.parentNode.replaceChild(sidebarElement.firstElementChild, skeleton);

    // Inicializa los iconos de Feather
    feather.replace();

    // Agrega los event listeners a los items del menú
    menuItems.forEach((item) => {
      const menuItem = document.getElementById(item.id);
      if (menuItem) {
        menuItem.addEventListener("click", (e) => {
          e.preventDefault();
          // Actualiza el estado activo en los datos
          menuItems.forEach((mi) => (mi.isActive = mi.id === item.id));
          // Actualiza la UI
          updateActiveStates();
        });
      }
    });
  }
}

// Función para actualizar los estados activos en la UI
function updateActiveStates() {
  menuItems.forEach((item) => {
    const menuItem = document.getElementById(item.id);
    if (menuItem) {
      if (item.isActive) {
        menuItem.classList.add("active-nav-item");
        menuItem.classList.remove("hover:bg-gray-100");
      } else {
        menuItem.classList.remove("active-nav-item");
        menuItem.classList.add("hover:bg-gray-100");
      }
    }
  });
}

// Plantilla del menú de la cuenta (incluida para funcionar con file://)
function getAccountMenuTemplate() {
  return `
    <div class="account-menu bg-white rounded-lg shadow-lg w-64 py-2">
        <!-- Información del usuario -->
        <div class="px-4 py-3 border-b border-gray-200">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <i data-feather="user"></i>
                </div>
                <div>
                    <div class="font-semibold">John Doe</div>
                    <div class="text-sm text-gray-500">john.doe@example.com</div>
                </div>
            </div>
        </div>

        <!-- Enlaces de la cuenta -->
        <nav class="py-2">
            <a href="#" class="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100">
                <i data-feather="user"></i>
                <span>Profile</span>
            </a>
            <a href="#" class="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100">
                <i data-feather="credit-card"></i>
                <span>Billing</span>
            </a>
            <a href="#" class="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100">
                <i data-feather="bell"></i>
                <span>Notifications</span>
            </a>
        </nav>

        <!-- Separador -->
        <div class="border-t border-gray-200 my-1"></div>

        <!-- Opciones adicionales -->
        <nav class="py-2">
            <a href="components/support.html?from=dashboard" class="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100">
                <i data-feather="help-circle"></i>
                <span>Help & Support</span>
            </a>
            <a href="../index.html" class="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50">
                <i data-feather="log-out"></i>
                <span>Sign Out</span>
            </a>
        </nav>
    </div>
    `;
}

// Función para inicializar el menú de la cuenta (robusta y basada en delegación)
function initializeAccountMenu() {
  let menuLoaded = false;
  let menuContainer = null;

  // Delegación de eventos: manejamos clicks en todo el documento para
  // evitar errores si el sidebar aún no está en el DOM al inicializar.
  document.addEventListener("click", async (e) => {
    const accountButton = e.target.closest("#accountButton");

    // Si se hizo click en el botón Account
    if (accountButton) {
      // Asegurarnos de tener el contenedor del menú (crearlo si hace falta)
      menuContainer = document.getElementById("accountMenuContainer");
      if (!menuContainer) {
        menuContainer = document.createElement("div");
        menuContainer.id = "accountMenuContainer";
        menuContainer.className = "absolute bottom-full left-0 mb-2 hidden";
        // insertarlo en el padre del botón (el mismo contenedor relativo)
        accountButton.parentElement.appendChild(menuContainer);
      }

      // Cargar contenido la primera vez (usando plantilla embebida para file://)
      if (!menuLoaded) {
        try {
          const menuHTML = getAccountMenuTemplate();
          menuContainer.innerHTML = menuHTML;
          menuLoaded = true;
          feather.replace();
        } catch (err) {
          console.error("Error al generar account-menu:", err);
          menuContainer.innerHTML = '<div class="p-4 text-sm text-red-600">No se pudo cargar el menú</div>';
          menuLoaded = true;
        }
      }

      // Mostrar/ocultar
      menuContainer.classList.toggle("hidden");

      // Evitar que el click se propague y cierre inmediatamente
      e.stopPropagation();
      return;
    }

    // Si el click fue fuera del botón/menú, ocultar el menú si está abierto
    if (menuContainer && !e.target.closest(".account-menu") && !e.target.closest("#accountButton")) {
      menuContainer.classList.add("hidden");
    }
  });
}

// Inicializa la barra lateral lo antes posible
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initializeSidebar();
    initializeAccountMenu();
  });
} else {
  initializeSidebar();
  initializeAccountMenu();
}
