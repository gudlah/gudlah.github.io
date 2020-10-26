if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then(() => console.log("Pendaftaran ServiceWorker berhasil"))
            .then(() => requestPermission())
            .catch(() => console.log("Pendaftaran ServiceWorker gagal"))
    });
} else {
    console.log("ServiceWorker belum didukung browser ini.");
}
document.addEventListener("DOMContentLoaded", () => {
    if(new URLSearchParams(window.location.search).get('id')) {
        matches();
    } else {
        index();
    }
});
function requestPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(result => {
            if (result === "denied") {
                console.log("Fitur notifikasi tidak diijinkan.");
                return;
            } else if (result === "default") {
                console.error("Pengguna menutup kotak dialog permintaan ijin.");
            return;
            }
            subsPush();
        });
    }
}
function subsPush() {
    navigator.serviceWorker.ready.then(() => {
        if (('PushManager' in window)) {
            navigator.serviceWorker.getRegistration().then(registration => {
                registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array("BE2bo9Qpk3J3ALsPMnftXLjva7_gJS_MktQDXDgANAC3ule-e-Z5rPMmKL2bkZLOikYlXpQDsIiipl6176UMZJ0")
                }).then(subscribe => {
                    console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                    console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                        null, new Uint8Array(subscribe.getKey('p256dh')))));
                    console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                        null, new Uint8Array(subscribe.getKey('auth')))));
                }).catch(e => console.error('Tidak dapat melakukan subscribe ', e.message));
            });
        }
    })
}
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
function index() {
    getLeagues();
    M.Sidenav.init(document.querySelectorAll(".sidenav"));
    loadNav();
    let page = window.location.hash.substr(1);
    if(page === '') page = "dashboard";
    loadPage(page);
}
function loadNav() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4) {
            if(this.status !== 200) return;
            document.querySelectorAll(".topnav, .sidenav").forEach(elm => elm.innerHTML = xhttp.responseText);
            document.querySelectorAll(".sidenav a, .topnav a").forEach(elm => {
                elm.addEventListener("click", event => {
                    const sidenav = document.querySelector(".sidenav");
                    M.Sidenav.getInstance(sidenav).close();
                    page = event.target.getAttribute("href").substr(1);
                    loadPage(page);
                });
            });
        }
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
}
function loadPage(page) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4) {
            const content = document.querySelector("#body-content");
            if (page === "dashboard") {
                getLeagues();
            } else if (page === "saved") {
                getSavedLeagues();
            }
            
            if(this.status === 200) {
                    content.innerHTML = xhttp.responseText;
                    getLeagues();
            } else if (this.status === 404) {
                    content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
            } else {
                    content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
            }
        }
    };
    xhttp.open("GET", "pages/" + page + ".html", true);
    xhttp.send();
}
function matches() {
    if(new URLSearchParams(window.location.search).get('saved')) {
        btnDBElement('delete');
        getSavedLeagueById();
    } else {
        var item = getLeagueById();
        let cekDatabase = getById(parseInt(new URLSearchParams(window.location.search).get('id')));
        cekDatabase.then(ada => btnDBElement((ada)? 'delete' : 'save'));
    }
    document.addEventListener('click', e => {
        if(e.target.id === 'save') {
            item.then(matches => saveForLater(matches));
            btnDBElement('delete');
        } else if(e.target.id === 'delete') {
            if(confirm('Click yes to delete!')) {
                delById(parseInt(new URLSearchParams(window.location.search).get('id')));
                location.replace('index.html');    
            }
        }
    });
    function btnDBElement(val) {
        document.querySelector('.tombolBtn').innerHTML = `<i class="large material-icons" id="${val}">${val}</i>`;
    }
}