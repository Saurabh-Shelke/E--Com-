import React, { useState,useContext } from 'react';
import { CgClose } from "react-icons/cg";
import productCategory from '../helpers/productCategory';
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from "../context/index";
import AWS from 'aws-sdk';


const AdminEditProduct = ({
    onClose,
    productData,
    fetchdata
}) => {
    const [data, setData] = useState({
        ...productData,
        productName: productData?.productName,
        brandName: productData?.brandName,
        category: productData?.category,
        productImage: productData?.productImage || [],
        description: productData?.description,
        price: productData?.price,
        sellingPrice: productData?.sellingPrice,
        description: productData?.description,
        soldBy: productData?.soldBy,
        features: productData?.features,
        _id: productData?._id
    });
    const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState("");
    const { authToken } = useContext(Context); // Get the authToken from Context


    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleUploadProduct = async (e) => {
        const file = e.target.files[0];
    
        try {
            // Upload to S3 instead of Cloudinary
            const uploadImageS3 = await uploadImageToS3(file);
    
            setData((prev) => ({
                ...prev,
                productImage: [...prev.productImage, uploadImageS3] // Store S3 URL instead of Cloudinary
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };
    const s3 = new AWS.S3();


    const uploadImageToS3 = async (file) => {
        const params = {
            Bucket: process.env.REACT_APP_BUCKET_NAME,
            Key: `products/${Date.now()}_${file.name}`, // you can change the path as per your structure
            Body: file,
            // ACL: 'public-read', // makes the file publicly readable
            ContentType: file.type,
        };
    
        return new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data.Location); // URL of the uploaded file
            });
        });
    };

    const handleDeleteProductImage = async (index) => {
        console.log("image index", index);

        const newProductImage = [...data.productImage];
        newProductImage.splice(index, 1);

        setData((prev) => ({
            ...prev,
            productImage: [...newProductImage]
        }));
    }

    {/** Update Product */}
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(SummaryApi.updateProduct.url, {
            method: SummaryApi.updateProduct.method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`, 
              },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (responseData.success) {
            toast.success(responseData?.message);
            onClose();
            fetchdata();
        }

        if (responseData.error) {
            toast.error(responseData?.message);
        }
    }

    {/** Delete Product */}
    const handleDelete = async (e) => {
        e.preventDefault(); // Prevent form submission

        try {
            const response = await fetch(SummaryApi.deleteProduct.url, {
                method: SummaryApi.deleteProduct.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`, 
                  },
                body: JSON.stringify({ _id: data._id }),
            });

            const responseData = await response.json();

            if (responseData.success) {
                toast.error(responseData.message); // Show the toast in red color
                fetchdata();
                onClose(); // Close the modal
            } else {
                toast.error(responseData.message || 'An error occurred while deleting the product.');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete the product.');
        }
    };

    return (
        <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
            <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
                <div className='flex justify-between items-center pb-3'>
                    <h2 className='font-bold text-lg'>Edit Product</h2>
                    <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                        <CgClose/>
                    </div>
                </div>

                <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
                    <label htmlFor='productName'>Product Name :</label>
                    <input
                        type='text'
                        id='productName'
                        placeholder='enter product name'
                        name='productName'
                        value={data.productName}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='brandName' className='mt-3'>Brand Name :</label>
                    <input
                        type='text'
                        id='brandName'
                        placeholder='enter brand name'
                        value={data.brandName}
                        name='brandName'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='category' className='mt-3'>Category :</label>
                    <select required value={data.category} name='category' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'>
                        <option value={""}>Select Category</option>
                        {
                            productCategory.map((el, index) => {
                                return (
                                    <option value={el.value} key={el.value + index}>{el.label}</option>
                                )
                            })
                        }
                    </select>

                    <label htmlFor='productImage' className='mt-3'>Product Image :</label>
                    <label htmlFor='uploadImageInput'>
                        <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
                            <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                                <span className='text-4xl'><FaCloudUploadAlt /></span>
                                <p className='text-sm'>Upload Product Image</p>
                                <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct} />
                            </div>
                        </div>
                    </label>
                    <div>
                        {
                            data?.productImage[0] ? (
                                <div className='flex items-center gap-2'>
                                    {
                                        data.productImage.map((el, index) => {
                                            return (
                                                <div className='relative group' key={index}>
                                                    <img
                                                        src={el}
                                                        alt={el}
                                                        width={80}
                                                        height={80}
                                                        className='bg-slate-100 border cursor-pointer'
                                                        onClick={() => {
                                                            setOpenFullScreenImage(true)
                                                            setFullScreenImage(el)
                                                        }} />

                                                    <div className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer' onClick={()=>handleDeleteProductImage(index)}>
                                                        <MdDelete/>  
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            ) : (
                                <p className='text-red-600 text-xs'>*Please upload product image</p>
                            )
                        }

                    </div>

                    <label htmlFor='price' className='mt-3'>Price :</label>
                    <input
                        type='number'
                        id='price'
                        placeholder='enter price'
                        value={data.price}
                        name='price'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='sellingPrice' className='mt-3'>Selling Price :</label>
                    <input
                        type='number'
                        id='sellingPrice'
                        placeholder='enter selling price'
                        value={data.sellingPrice}
                        name='sellingPrice'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />
                    <label htmlFor='commissionPrice' className='mt-3'>Quantity :</label>
                    <input 
                    type='Number' 
                    id='quantity' 
                    placeholder='Enter quantity of product' 
                    value={data.quantity} 
                    name='quantity'
                    onChange={handleOnChange}
                    className='p-2 bg-slate-100 border rounded'
                    required
                    />

<label htmlFor='description' className='mt-3 block'>Description:</label>
<textarea
  id='description'
  placeholder='Enter description'
  value={data.description}
  name='description'
  onChange={handleOnChange}
  className='p-2 bg-slate-100 border rounded w-full h-10 overflow-y-auto'
></textarea>

{/* soldby Section */}
<label htmlFor='soldBy' className='mt-3 block'>Sold By:</label>
<textarea
  id='soldBy'
  placeholder='Enter Sold by'
  value={data.soldBy}
  name='soldBy'
  onChange={handleOnChange}
  className='p-2 bg-slate-100 border rounded w-full h-10 overflow-y-auto'
></textarea>

{/* Features Section */}
<label htmlFor='features' className='mt-3 block'>Features:</label>
<textarea
  id='features'
  placeholder='Enter features (use new line for each bullet point)'
  value={data.features}
  name='features'
  onChange={handleOnChange}
  className='p-2 bg-slate-100 border rounded w-full h-10 overflow-y-auto'
></textarea>

{/* Product Information Section */}
<label htmlFor='productInfo' className='mt-3 block'>Product Information:</label>
<textarea
  id='productInfo'
  placeholder='Enter product information (use new line for each bullet point)'
  value={data.productInfo}
  name='productInfo'
  onChange={handleOnChange}
  className='p-2 bg-slate-100 border rounded w-full h-10 overflow-y-auto'
></textarea>

                    <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700' type='submit'>Update Product</button>
                    <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700' onClick={handleDelete}>Delete Product</button>
                </form>

            </div>
            {
                openFullScreenImage && (
                    <DisplayImage image={fullScreenImage} onClose={() => setOpenFullScreenImage(false)} />
                )
            }
        </div>
    );
}

export default AdminEditProduct;