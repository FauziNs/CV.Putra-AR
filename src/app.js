document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            { id: 1, name: 'Otak Otak', img: '1.jpeg', price: 20000 },
            { id: 2, name: 'Baso Sapi', img: '2.jpg', price: 25000 },
            { id: 3, name: 'Basreng', img: '3.jpg', price: 30000 },
            { id: 4, name: 'Cimol Ayam', img: '4.jpg', price: 2000 },
            { id: 5, name: 'Stik Bawang', img: '5.jpg', price: 30000 },
            { id: 6, name: 'Basreng Ayam', img: '6.jpg', price: 30000 },
        ],
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem) {
            // cek apakah ada barang yang sama di cart
            const cartItem = this.items.find((item) => item.id === newItem.id);

            // jika belum ada / cart masih kosong
            if (!cartItem) {
                this.items.push({ ...newItem, quantity: 1, total: newItem.price });
                this.quantity++;
                this.total += newItem.price;
            } else {
                // jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
                this.items = this.items.map((item) => {
                    // jika barang berbeda
                    if (item.id !== newItem.id) {
                        return item;
                    } else {
                        // jika barang sudah ada, tambah quantity dan totalnya
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price;
                        return item;
                    }
                });
            }
        },
        remove(id) {
            // ambil item yang mau di remove berdasarkan id nya
            const cartItem = this.items.find((item) => item.id === id);

            //jika item lebih dari 1
            if (cartItem.quantity > 1) {
                //telusuri 1 1
                this.items = this.items.map((item) => {
                    //jika bukan barang yang diklik
                    if (item.id !== id) {
                        return item;
                    } else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity--;
                        this.total -= item.price;
                        return item;
                    }
                });
            } else if (cartItem.quantity === 1) {
                //jika barangya sisa 1
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cartItem.price;
            }
        },
    });
});


// form validation
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function () {
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i].value.length !== 0) {
           checkoutButton.disabled = false;
           checkoutButton.classList.remove('disabled');
           return;
        }
    }
    checkoutButton.disabled = true;
    checkoutButton.classList.add('disabled');
});
  

// kirim data ketika tombol checkout diklik
checkoutButton.addEventListener('click', function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    const message = formMessage(objData);
    window.open(`https://wa.me/6281310641534?text=` + encodeURIComponent(message));
});

// format pesan whatsapp
const formMessage = (obj) => {
    return `Data Customer
Nama: ${obj.name}
Email: ${obj.email}
No Hp: ${obj.phone}

Data Pesanan 
${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity}) x ${rupiah(item.total)}`).join('\n')}
TOTAL: ${rupiah(obj.total)}`;
};

// konversi ke rupiah
function rupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
}


