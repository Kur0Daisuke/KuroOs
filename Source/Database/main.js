class Db{
    constructor() {
        const dbName = "FilesDatabase";
        const request = indexedDB.open(dbName, 2);
        this.db;

        this.DEFAULT_FILE_DATA = [
            { 
                type: "folder",
                name: "This PC", 
            },
            { 
                type: "folder",
                name: "This PC/photos",
                children: []
            },
            { 
                type: "folder",
                name: "This PC/documents",
                children: []
            },
            { 
                type: "folder",
                name: "This PC/Desktop",
            },
            { 
                type: "folder",
                name: "This PC/Desktop/My PC",
            },
            { 
                type: "RecycleBin",
                name: "This PC/Desktop/folder",
            },
        ];

        request.onerror = (event) => {
            console.error(`Database error: ${event.target.errorCode}`);
        };
        request.onsuccess = (event) => {
            this.db = event.target.result;
            const transaction = this.db.transaction(["Files"]);
            const objectStore = transaction.objectStore("Files");
            const request = objectStore.get("This PC");
            request.onerror = (event) => {
            // Handle errors!
            };
            request.onsuccess = (event) => {
                // Do something with the request.result!
                console.log(`data for SSN ${"Desktop"} is ${JSON.stringify(request.result)}`);
            };
        }
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
    }
}

export default Db;