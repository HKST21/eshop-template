import { useState, useEffect } from "react"
import './AddProduct.css'
import eshop from "../class/eshopFeClass";



export function AddProduct() {

    
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedPic, setUploadedPic] = useState<File>();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formKey, setFormKey] = useState(0);
    const [confirmation, setConfirmation] = useState<boolean>(false)


    const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        try {
            const data = new FormData(e.currentTarget);

        const newProduct = {
            id: Math.random() ,
            name: data.get('name') as string,
            price: Number(data.get('price')),
            discount: Number(data.get('discount')),
            description: data.get('description') as string,
            stockQuantity: Number(data.get('stock quantity')),
            image_url: '',

        }
        
        data.append('product', JSON.stringify(newProduct)); // do objektu data ve formátu formData přidávám vlastnost product jejíž hodnota je stringyfikovanej newProduct
        console.log('uploaded pic: ', uploadedPic)
        if (uploadedPic) {
            data.append('image', uploadedPic) // do objektu vkládám další vlastnost, která je už nahraný obrázek. Potřebujeme ho dostat na server a formData nám to umožní
        }
        
        console.log('formdata object: ', data)
        await eshop.createProduct(data)

        setConfirmation(true)
        setTimeout(() => setConfirmation(false), 2000)

        }

        catch(e) {
            console.log('failed to add product', e)
            throw e
        }

        setTimeout(() => setFormKey(prev => prev + 1), 2000) // vynutím reset formu

        
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const upload = e.dataTransfer.files;

        const file = upload[0] // něco jako pole, na prvnim indexu je prvni dropnutá věc

        if ((file.type === "image/png" || file.type === "image/jpg") && (file.size < 5000000)) {
            setUploadedPic(file);
            setIsDragging(false);
        }

        else {
            alert("file not supported")
        }

        const fileUrl = URL.createObjectURL(file);

        setPreviewUrl(fileUrl)

    }

    const handleEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);

    }

    const handleLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false)
    }

    useEffect(() => {
        // Cleanup funkce při unmountovani komponenty pro vyčištění URL.    DOUČIT
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);






    return (
        <div>
            <h2>Welcome to Adding Product administration</h2>
            <form onSubmit={handleAddProduct} key={formKey}>
                <p />
                <div>NEW PRODUCT</div>
                <input
                
                    name="name"
                    type="text"
                    placeholder="product name"
                    required>
                </input>
                <p />

                <input
                    name="price"
                    type="number"
                    placeholder="price in eur"
                    required>
                </input>
                <p/>
                <input
                name="discount"
                type="number"
                placeholder="discount in %">
                </input>
                <p />
                <textarea
                    name="description"
                    placeholder="product description with minimally 100 characters"

                    minLength={100}
                    rows={10}
                    cols={40}
                    style={{
                        width: '50%',
                        padding: '10px'
                    }}
                    required>
                </textarea>
                <p />
                <input
                    name="stock quantity"
                    type="text"
                    placeholder="amount of products">
                </input>
                <p />
                <div className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnter={handleEnter}
                    onDragLeave={handleLeave}
                >Drag & drop image here</div>
                <p />
                {confirmation && <>
                PRODUCT ADDED</>}

                {previewUrl &&
                    (<div>
                        <span>Uploaded files: </span>
                        <img className="preview-pic"
                            src={previewUrl}
                            alt="Preview"
                            style={{ maxWidth: '200px' }}
                        />
                    </div>
                    )}
                <button type="submit">CONFIRM</button>
            </form>
        </div>
    )

}