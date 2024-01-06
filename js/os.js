// class OS{
//     constructor() {
//         this.request = window.indexedDB.open("OSfolders", 3);
//         this.db;
//         this.menuOpened = false;
//     }
//     _Start() {
//         document.querySelector(".os").style.display = "flex"
//         document.querySelector(".terminal").style.display = "none"
//         document.addEventListener("mouseup", (e) => {
//             if(e.button == 0) {
//                 if(this.menuOpened) {
//                     document.querySelector(".rightClickMenu").style.display = "none";
//                     this.menuOpened = false;
//                 }
//             }else if(e.button == 2) {
//                 this.menuOpened = true;
//                 document.querySelector(".rightClickMenu").style.display = "block";
//                 document.querySelector(".rightClickMenu").style.left = `${e.clientX}px`
//                 document.querySelector(".rightClickMenu").style.top = `${e.clientY}px`
//             }
//             e.preventDefault();
//         })
//         document.addEventListener("contextmenu", (e) => e.preventDefault())
//     }
//     Load() {
//         this.request.onsuccess = (e) => {
//             this.db = e.target.result;
//             this.db.onerror = (e) => {
//                 console.error(e.target.errorCode);
//             }
//             this.db
//                 .transaction("folders")
//                 .objectStore("folders")
//             .get("parent").onsuccess = (event) => {
//                 this._Start();
//                 console.log(`main is ${JSON.stringify(event.target.result)}`);
//             };
//             console.log("done initializing the database")
//         }
//         this.request.onupgradeneeded = (event) => {
//             const folderDefault = [
//                 { foldername: "My PC", childrens: [], main: "parent" }
//             ];
//             let DB = event.target.result;
//             const objStore = DB.createObjectStore("folders", { autoIncrement: true, keyPath: "main" });
          
//             folderDefault.forEach((folder) => {
//                 objStore.add(folder);
//             });
//         };
//     }
// }