const fs = require('fs');

// Read files
const scriptContent = fs.readFileSync('/Users/Melody/Desktop/DROP-SHOP/script.js', 'utf8');
const cleanedProducts = fs.readFileSync('/Users/Melody/Desktop/DROP-SHOP/products_cleaned.js', 'utf8');

// Extract just the array part from cleaned products
const arrayMatch = cleanedProducts.match(/window\.PRODUCTS\s*=\s*\[([\s\S]*?)\];/);
if (!arrayMatch) {
    console.error('Could not find PRODUCTS array in cleaned file');
    process.exit(1);
}

const cleanedArray = arrayMatch[0];

// Replace in original script
const newScript = scriptContent.replace(/window\.PRODUCTS\s*=\s*\[[\s\S]*?\];/, cleanedArray);

// Write back
fs.writeFileSync('/Users/Melody/Desktop/DROP-SHOP/script.js', newScript, 'utf8');

console.log('✅ Successfully replaced PRODUCTS array with cleaned version!');
console.log('Products with broken images have been removed.');
