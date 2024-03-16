import { client } from "@gradio/client"
import { useState, useEffect } from "react";

// Allow the user to upload an image and have that image be classified
// How to store the image? How to reference it?

async function UploadImageToClassify() : Promise<Blob> {
    const response_0 = await fetch("https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png");
    const exampleImage = await response_0.blob();

    return exampleImage
}

async function Classify(inputImage : Blob) : Promise<string|void>  {   
    try {
        console.log("Input image", inputImage);            
        const app = await client("ckirby19/couples-dance-classifier", {});
        console.log("App",app)
        const result : any = await app.predict("/predict", [
            inputImage, 	// blob in 'img' Image component
        ]);
        // const data = (result as string);
        // const data : string | unknown = result.data
        // console.log(result.data);
    
        return result.data;
    }  
    catch (error){
        console.log("Error in classify", error)
    }

}

export default function ClassificationDisplay(){
    const [curImage, setImage] = useState(new Blob());
    const [currentClass, setClass] = useState("");

    useEffect(() => { 
        Classify(curImage).then((value) => setClass(value as string))
    }, [curImage])

    return (
        <>
            {curImage != null && <img 
                    src={"data:image/png;base64," + curImage} 
                    alt="uploaded doc that has been classified"
                />
                && 
                <h2>Classification is {currentClass}</h2>
            }
            <button 
                onClick={async () => setImage(await UploadImageToClassify())}
                title="Upload Image"
            />
        </>
    )

}



