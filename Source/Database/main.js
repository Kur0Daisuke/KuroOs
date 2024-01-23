class Db{
    constructor() {
        this.db;
        this.DEFAULT_FILE_DATA = [
            { 
                type: "folder",
                dirpath: "/",
                name: "This PC", 
                icon: "desktop-outline"
            },
            { 
                type: "folder",
                dirpath: "/This PC/",
                name: "photos",
                icon: "images-outline"
            },
            { 
                type: "folder",
                dirpath: "/This PC/",
                name: "documents",
                icon: "document-text-outline"
            },
            { 
                type: "folder",
                dirpath: "/This PC/",
                name: "Desktop",
                icon: "desktop-outline"
            },
            { 
                type: "folder",
                dirpath: "/This PC/Desktop/",
                name: "My PC",
                icon: "desktop-outline"
            },
            { 
                type: "folder",
                dirpath: "/This PC/Desktop/",
                name: "RecycleBin",
                icon: "trash-bin-outline"
            },
        ];
    }
    Init() {
        return new Promise((res) => {
            const dbName = "FilesDatabase";
            const request = indexedDB.open(dbName, 2);

            request.onerror = (event) => {
                console.error(`Database error: ${event.target.errorCode}`);
            };
            request.onsuccess = (event) => res()
            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                const objectStore = this.db.createObjectStore("Files", { keyPath: "name" });

                objectStore.transaction.oncomplete = (event) => {
                    const customerObjectStore = this.db
                    .transaction("Files", "readwrite")
                    .objectStore("Files");

                    this.DEFAULT_FILE_DATA.forEach((data) => {
                        customerObjectStore.add(data);
                    });
                };
            };
        })
    }
    GetData(dir) {
        return new Promise((res) => {
            const dbName = "FilesDatabase";
            const request = indexedDB.open(dbName, 2);

            request.onsuccess = (event) => {
                this.db = event.target.result;
                const transaction = this.db.transaction(["Files"]);
                const objectStore = transaction.objectStore("Files");
                const request = objectStore.getAll();
                request.onerror = (event) => {
                    // Handle errors!
                };
                request.onsuccess = (event) => {
                    let data = request.result
                    let result = [];
                    if(dir == undefined) res(data)
                    else {
                        data.forEach((e) => {
                            if(e.dirpath == dir) result.push(e)
                        })
                        res(result)
                    }
                };
            }
        })
    }
}

export default Db;