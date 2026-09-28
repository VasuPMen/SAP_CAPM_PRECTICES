const fs = require('fs').promises;

const handleFile = async () => {
  try {
    let fileContent = "";
    for (let i = 1; i <= 100; i++) {
      fileContent += `${i} : line${i}\n`;
    }

    await fs.writeFile("message.txt", fileContent.trim());
    
    const data = await fs.readFile("message.txt", "utf8");
    // console.log(data);
    
  } catch (error) {
    console.error(error.message);
  }
};


const deleteFile  = async ()=>{
  const filepath = "/home/user/projects/SAP_SAMPLE_PROJECT/message.txt"
  try {
    await fs.unlink(filepath)
    console.log("deleted")
  } catch (error) {
    console.error(error)
  }
}

handleFile();

// deleteFile()
