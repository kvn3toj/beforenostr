// Script temporal para debuggear el cursor pointer
// Este script simula lo que hace el test de Playwright

console.log("🔍 DEBUGGING CURSOR POINTER STYLES");
console.log("=".repeat(50));

const elements = document.querySelectorAll('*');
let elementsWithPointer = [];
let totalChecked = 0;

console.log(`📊 Total de elementos en la página: ${elements.length}`);
console.log(`🎯 Revisando los primeros 100 elementos (como hace el test):`);

for (let i = 0; i < Math.min(elements.length, 100); i++) {
  const el = elements[i];
  const styles = window.getComputedStyle(el);
  totalChecked++;
  
  if (styles.cursor === 'pointer') {
    elementsWithPointer.push({
      index: i,
      tagName: el.tagName,
      className: el.className,
      id: el.id,
      role: el.getAttribute('role'),
      onclick: !!el.onclick
    });
  }
}

console.log(`\n✅ Elementos con cursor: pointer encontrados: ${elementsWithPointer.length}/${totalChecked}`);

if (elementsWithPointer.length > 0) {
  console.log("\n🎯 ELEMENTOS CON CURSOR POINTER:");
  elementsWithPointer.forEach((el, index) => {
    console.log(`${index + 1}. <${el.tagName.toLowerCase()}> ${el.className ? `class="${el.className}"` : ''} ${el.id ? `id="${el.id}"` : ''} ${el.role ? `role="${el.role}"` : ''} ${el.onclick ? 'onclick=true' : ''}`);
  });
} else {
  console.log("\n❌ NO SE ENCONTRARON ELEMENTOS CON CURSOR POINTER");
  console.log("Mostrando los primeros 10 elementos para debug:");
  for (let i = 0; i < Math.min(10, elements.length); i++) {
    const el = elements[i];
    const styles = window.getComputedStyle(el);
    console.log(`${i + 1}. <${el.tagName.toLowerCase()}> cursor: ${styles.cursor} ${el.className ? `class="${el.className}"` : ''}`);
  }
}

console.log(`\n🧪 RESULTADO DEL TEST: ${elementsWithPointer.length > 0 ? 'PASS ✅' : 'FAIL ❌'}`);
console.log("=".repeat(50)); 