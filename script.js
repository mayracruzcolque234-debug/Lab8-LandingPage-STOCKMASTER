/**
 * STOCKMASTER - Landing Page Profesional
 * Laboratorio 8: Proyecto Académico Universitario
 * Archivo: script.js (Lógica interactiva en JavaScript Vanilla)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. GESTIÓN DEL MENÚ MÓVIL (DRAWER RESPONSIVO)
     ========================================================================== */
  const navToggle = document.getElementById('navToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-btn');

  function openMobileMenu() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Evita scroll de fondo
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (navToggle) navToggle.addEventListener('click', openMobileMenu);
  if (drawerClose) drawerClose.addEventListener('click', closeMobileMenu);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeMobileMenu);

  // Cerrar el drawer al pulsar en cualquier enlace de navegación
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    }
  });


  /* ==========================================================================
     2. SOMBRA DEL ENCABEZADO Y BOTÓN VOLVER ARRIBA
     ========================================================================== */
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Sombra del header
    if (scrollPos > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Botón volver arriba
    if (scrollPos > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    // Actualizar enlace activo en navbar según la sección visible (Scrollspy)
    updateActiveNavLink();
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  /* ==========================================================================
     3. RESALTADO DEL ENLACE ACTIVO AL HACER SCROLL (SCROLLSPY)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-menu .nav-link');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }


  /* ==========================================================================
     4. SIMULADOR INTERACTIVO DEMO DE PRODUCTOS Y CATEGORÍAS
     ========================================================================== */

  // Categorías base del sistema
  const categoriesList = [
    { id: 'tecnologia', name: 'Tecnología', code: 'TEC', class: 'cat-tec' },
    { id: 'papeleria',  name: 'Papelería',  code: 'PAP', class: 'cat-pap' },
    { id: 'alimentos',  name: 'Alimentos',  code: 'ALI', class: 'cat-ali' },
    { id: 'hogar',      name: 'Hogar',      code: 'HOG', class: 'cat-hog' }
  ];

  // Base de datos en memoria para el simulador del navegador
  let demoProducts = [
    {
      id: 1,
      name: 'Auriculares Bluetooth Pro',
      category: 'tecnologia',
      sku: 'TEC-001',
      price: 45.00,
      stock: 24,
      minStock: 5
    },
    {
      id: 2,
      name: 'Cuaderno Profesional Rayado',
      category: 'papeleria',
      sku: 'PAP-089',
      price: 4.20,
      stock: 3,
      minStock: 8
    },
    {
      id: 3,
      name: 'Teclado Mecánico RGB',
      category: 'tecnologia',
      sku: 'TEC-042',
      price: 59.99,
      stock: 0,
      minStock: 4
    },
    {
      id: 4,
      name: 'Café Grano Especial 500g',
      category: 'alimentos',
      sku: 'ALI-115',
      price: 12.50,
      stock: 18,
      minStock: 6
    },
    {
      id: 5,
      name: 'Lámpara LED Escritorio',
      category: 'hogar',
      sku: 'HOG-023',
      price: 28.00,
      stock: 9,
      minStock: 4
    },
    {
      id: 6,
      name: 'Set Marcadores Fluorescentes',
      category: 'papeleria',
      sku: 'PAP-044',
      price: 6.80,
      stock: 14,
      minStock: 5
    }
  ];

  let currentCategoryFilter = 'todas';
  let currentSearchQuery = '';

  // Elementos DOM del simulador
  const categoryFiltersContainer = document.getElementById('categoryFiltersContainer');
  const demoProductsGrid = document.getElementById('demoProductsGrid');
  const demoEmptyState = document.getElementById('demoEmptyState');
  const demoSearchInput = document.getElementById('demoSearchInput');
  const btnResetFilters = document.getElementById('btnResetFilters');

  // Elementos de métricas del simulador
  const statVisibleCount = document.getElementById('statVisibleCount');
  const statTotalValue = document.getElementById('statTotalValue');
  const statAlertCount = document.getElementById('statAlertCount');
  const countAll = document.getElementById('countAll');

  // Modal para añadir producto
  const addProductModal = document.getElementById('addProductModal');
  const btnOpenAddModal = document.getElementById('btnOpenAddModal');
  const btnCloseAddModal = document.getElementById('btnCloseAddModal');
  const btnCancelModal = document.getElementById('btnCancelModal');
  const addProductForm = document.getElementById('addProductForm');
  const prodCategorySelect = document.getElementById('prodCategory');

  /**
   * Inicializa las pastillas de categorías con sus conteos
   */
  function renderCategoryPills() {
    countAll.textContent = demoProducts.length;

    // Mantener la pastilla 'Todas' y regenerar las específicas
    const pillsHTML = categoriesList.map(cat => {
      const count = demoProducts.filter(p => p.category === cat.id).length;
      const isActive = currentCategoryFilter === cat.id ? 'active' : '';
      return `
        <button class="cat-pill ${isActive}" data-category="${cat.id}">
          ${cat.name} <span class="pill-count">${count}</span>
        </button>
      `;
    }).join('');

    categoryFiltersContainer.innerHTML = `
      <button class="cat-pill ${currentCategoryFilter === 'todas' ? 'active' : ''}" data-category="todas">
        Todas <span class="pill-count">${demoProducts.length}</span>
      </button>
      ${pillsHTML}
    `;

    // Asignar listeners a las pastillas
    categoryFiltersContainer.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategoryFilter = btn.getAttribute('data-category');
        renderCategoryPills();
        renderProducts();
      });
    });
  }

  /**
   * Población del <select> de categorías dentro del modal
   */
  function populateModalCategories() {
    prodCategorySelect.innerHTML = categoriesList.map(cat => `
      <option value="${cat.id}">${cat.name} (${cat.code})</option>
    `).join('');
  }

  /**
   * Determina la clase y texto del chip de estado según las existencias
   */
  function getStockStatus(stock, minStock) {
    if (stock <= 0) {
      return {
        badgeClass: 'chip-danger',
        label: 'Agotado (0 uds)',
        isAlert: true
      };
    }
    if (stock <= minStock) {
      return {
        badgeClass: 'chip-warning',
        label: `Stock bajo (${stock} uds)`,
        isAlert: true
      };
    }
    return {
      badgeClass: 'chip-success',
      label: `En stock (${stock} uds)`,
      isAlert: false
    };
  }

  /**
   * Renderiza las tarjetas de productos según filtros activos
   */
  function renderProducts() {
    const query = currentSearchQuery.trim().toLowerCase();

    // Filtrar por categoría y texto de búsqueda
    const filtered = demoProducts.filter(item => {
      const matchesCategory = (currentCategoryFilter === 'todas') || (item.category === currentCategoryFilter);
      const matchesQuery = item.name.toLowerCase().includes(query) || item.sku.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });

    // Calcular estadísticas
    let totalStockValue = 0;
    let alertProductsCount = 0;

    demoProducts.forEach(item => {
      totalStockValue += (item.price * item.stock);
      if (item.stock <= item.minStock) {
        alertProductsCount++;
      }
    });

    // Actualizar métricas visuales
    statVisibleCount.textContent = filtered.length;
    statTotalValue.textContent = `$${totalStockValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    statAlertCount.textContent = alertProductsCount;

    // Manejo de estado vacío
    if (filtered.length === 0) {
      demoProductsGrid.innerHTML = '';
      demoEmptyState.style.display = 'block';
      return;
    } else {
      demoEmptyState.style.display = 'none';
    }

    // Render de tarjetas interactivas
    demoProductsGrid.innerHTML = filtered.map(item => {
      const catObj = categoriesList.find(c => c.id === item.category) || { name: item.category, class: 'cat-default' };
      const status = getStockStatus(item.stock, item.minStock);

      return `
        <article class="demo-product-card" data-id="${item.id}">
          <div class="card-top">
            <span class="product-cat-tag ${catObj.class}">${catObj.name}</span>
            <span class="product-sku">${item.sku}</span>
          </div>

          <h4 class="product-name">${escapeHTML(item.name)}</h4>

          <div class="product-details">
            <div class="detail-item">
              <span class="detail-label">Precio Unitario</span>
              <span class="detail-val">$${Number(item.price).toFixed(2)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Mín. Alerta</span>
              <span class="detail-val">${item.minStock} uds</span>
            </div>
          </div>

          <div class="card-bottom">
            <span class="status-chip ${status.badgeClass}">${status.label}</span>

            <!-- Botones interactivos para ajustar stock en la demo -->
            <div class="demo-card-actions" title="Ajustar existencias en el simulador">
              <button class="btn-icon-action btn-decrease-stock" data-id="${item.id}" title="Restar 1 unidad">
                <i class="fa-solid fa-minus"></i>
              </button>
              <button class="btn-icon-action btn-increase-stock" data-id="${item.id}" title="Añadir 1 unidad">
                <i class="fa-solid fa-plus"></i>
              </button>
              <button class="btn-icon-action delete-btn btn-delete-product" data-id="${item.id}" title="Eliminar del simulador">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Añadir eventos a los botones de stock interactivo dentro de cada tarjeta
    demoProductsGrid.querySelectorAll('.btn-decrease-stock').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        modifyProductStock(id, -1);
      });
    });

    demoProductsGrid.querySelectorAll('.btn-increase-stock').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        modifyProductStock(id, +1);
      });
    });

    demoProductsGrid.querySelectorAll('.btn-delete-product').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        deleteDemoProduct(id);
      });
    });
  }

  /**
   * Modifica las existencias de un producto en el simulador
   */
  function modifyProductStock(productId, delta) {
    const product = demoProducts.find(p => p.id === productId);
    if (product) {
      const newStock = product.stock + delta;
      if (newStock >= 0) {
        product.stock = newStock;
        renderProducts();
        renderCategoryPills();
      }
    }
  }

  /**
   * Elimina un producto de prueba en el simulador
   */
  function deleteDemoProduct(productId) {
    demoProducts = demoProducts.filter(p => p.id !== productId);
    renderProducts();
    renderCategoryPills();
  }

  /**
   * Filtro de búsqueda en tiempo real
   */
  if (demoSearchInput) {
    demoSearchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderProducts();
    });
  }

  // Botón para resetear filtros
  if (btnResetFilters) {
    btnResetFilters.addEventListener('click', () => {
      currentSearchQuery = '';
      currentCategoryFilter = 'todas';
      if (demoSearchInput) demoSearchInput.value = '';
      renderCategoryPills();
      renderProducts();
    });
  }

  /* ==========================================================================
     5. MODAL: REGISTRO DE PRODUCTO EN EL SIMULADOR
     ========================================================================== */
  function openAddModal() {
    addProductModal.classList.add('active');
    addProductModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('prodName').focus();
  }

  function closeAddModal() {
    addProductModal.classList.remove('active');
    addProductModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    addProductForm.reset();
  }

  if (btnOpenAddModal) btnOpenAddModal.addEventListener('click', openAddModal);
  if (btnCloseAddModal) btnCloseAddModal.addEventListener('click', closeAddModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeAddModal);

  // Cerrar al pulsar fuera de la ventana modal
  if (addProductModal) {
    addProductModal.addEventListener('click', (e) => {
      if (e.target === addProductModal) {
        closeAddModal();
      }
    });
  }

  // Manejo del formulario de alta en el simulador
  if (addProductForm) {
    addProductForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('prodName').value.trim();
      const category = document.getElementById('prodCategory').value;
      const sku = document.getElementById('prodSku').value.trim().toUpperCase();
      const price = parseFloat(document.getElementById('prodPrice').value);
      const stock = parseInt(document.getElementById('prodStock').value, 10);
      const minStock = parseInt(document.getElementById('prodMinStock').value, 10) || 5;

      if (!name || !sku || isNaN(price) || isNaN(stock)) {
        alert('Por favor completa todos los campos requeridos.');
        return;
      }

      // Crear nuevo producto en el simulador
      const newProduct = {
        id: Date.now(),
        name,
        category,
        sku,
        price,
        stock,
        minStock
      };

      // Añadir al inicio de la lista
      demoProducts.unshift(newProduct);

      // Cerrar modal y refrescar la vista
      closeAddModal();
      renderCategoryPills();
      renderProducts();

      // Notificación visual temporal
      showToastNotification(`Producto "${name}" agregado con éxito al simulador.`);
    });
  }

  /**
   * Muestra un aviso flotante (Toast)
   */
  function showToastNotification(message) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '2rem';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    toast.style.backgroundColor = '#0f172a';
    toast.style.color = '#ffffff';
    toast.style.padding = '0.75rem 1.5rem';
    toast.style.borderRadius = '9999px';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    toast.style.fontSize = '0.875rem';
    toast.style.fontWeight = '600';
    toast.style.zIndex = '2000';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '0.5rem';
    toast.style.transition = 'all 0.3s ease';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> ${message}`;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  /**
   * Sanitización básica de strings para el simulador
   */
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  /* ==========================================================================
     6. INICIALIZACIÓN
     ========================================================================== */
  populateModalCategories();
  renderCategoryPills();
  renderProducts();

  console.log('STOCKMASTER Landing Page cargada correctamente. Laboratorio 8 listo.');
});
