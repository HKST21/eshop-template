import { useState, useEffect, FormEventHandler } from "react"
import './AddProduct.css'
import eshop from "../class/eshopFeClass";
import { Product } from "../types/types";


interface AddProductProps {
    products: Product[]
}
export function AddProduct({ products }: AddProductProps) {


    const [isDragging, setIsDragging] = useState(false);
    const [uploadedPic, setUploadedPic] = useState<File>();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formKey, setFormKey] = useState(0);
    const [confirmation, setConfirmation] = useState<boolean>(false);
    const [choice, setChoice] = useState<'add product' | 'edit product'>('add product');
    const [showEdit, setShowEdit] = useState<{ [key: number]: boolean }>({

    });
    const [editableProduct, setEditableProduct] = useState({
        
        name: "",
        price: 0,
        discount: 0,
        stockQuantity: 0,
        description: ""
        
    })

    


    const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        try {
            const data = new FormData(e.currentTarget);

            const newProduct = {
                id: Math.random(),
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

        catch (e) {
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

    const handleShowEdit = (id: number) => {

        console.log("id produktu", id);

        const productToEdit = products.find(p => p.id === id); // musíme najít v products produkt který odpovídá id produktu, které bylo zavoláné při showEdit

        if (productToEdit) { // když ho najdem

            setEditableProduct({ // přepíšeme počáteční hodnoty, které byly při nastavení stavu objektu
                name: productToEdit.name,
                price: productToEdit.price,
                discount: productToEdit.discount ?? 0,
                stockQuantity: productToEdit.stockQuantity,
                description: productToEdit.description
    
            })

        }
        

        if (id) {
            setShowEdit({
                [id]: true
            })
        }


        console.log("po zavolání handleru vypadá showedit takhle", showEdit)

    }

    const handleEditProduct = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {

        e.preventDefault();

        const name = e.target.name // vytáhneme name inputu
        const value = e.target.value // vytáhneme hodnotu co napsal uživatel inputu

        console.log(name)

        setEditableProduct({
            ...editableProduct,
            [name]: value // název vlastnosti objektu je stejná jako name inputu, použijeme jako klíč pro definování vlastnosti která se má upravit, přidáme value z inputu
        })

        console.log(editableProduct)

        


        

       

    }




    return (
        <>
            <h2>Welcome to Products administration</h2>
            <div className="button-container">
                <button onClick={() => setChoice('add product')}>ADD NEW PRODUCT</button>
                <button onClick={() => setChoice('edit product')}>EDIT EXISTING PRODUCTS</button>
            </div>
            {choice === 'add product' && <div>


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
                    <p />
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
            </div>}
            {choice === 'edit product' &&
                <div>
                    <h2>EDITING EXISTING PRODUCTS</h2>
                    {products.map((product, i) => (
                        <div key={product.id}>
                            <div className="edit-product" >
                                {product.name}
                                {product.price}
                                {product.discount}
                                {product.final_price}
                                {product.stockQuantity}
                                {product.description}
                                
                                <button onClick={() => handleShowEdit(product.id)}>edit</button>

                            </div>
                            {showEdit[product.id] === true &&
                                <form>
                                    <input
                                    type="text"
                                    name="name"
                                    placeholder="product name"
                                    onChange={handleEditProduct}
                                    value={editableProduct.name}
                                    />
                                    <input
                                    type="number"
                                    name="price"
                                    placeholder="price"
                                    onChange={handleEditProduct}
                                    value={editableProduct.price}
                                    />
                                    <input
                                    type="number"
                                    name="discount"
                                    placeholder="discount in %"
                                    onChange={handleEditProduct}
                                    value={editableProduct.discount}
                                    />
                                    <input
                                    type="number"
                                    name="stockQuantity"
                                    placeholder="new stock quantity"
                                    onChange={handleEditProduct}
                                    value={editableProduct.stockQuantity}
                                    />
                                    <textarea
                                    placeholder="description"
                                    name="description"
                                    onChange={handleEditProduct}
                                    value={editableProduct.description}
                                    />
                                </form>}
                        </div>
                    ))}

                </div>}
        </>
    )

}