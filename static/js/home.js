document.addEventListener("DOMContentLoaded", codeToRun);

function codeToRun() {
    const path = document.getElementById("img");
    const submit = document.getElementById("submit");
    const picture = document.getElementsByClassName("picture")[0];
    colors = [];

    submit.addEventListener("click", function (event) {
        event.preventDefault();
        const formData = new FormData();
        selectedFile = path.files[0];
        formData.append("image", selectedFile);
        fetch("/upload-image", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                const colors = data["colors"];
                const palette = document.createElement("div");
                const codes = document.createElement("div");
                palette.className = "colors";
                codes.className = "codes";
                document.body.appendChild(palette);
                document.body.appendChild(codes);
                for (i = 0; i < 4; i++) {
                    color = document.createElement("div");
                    colorCode = document.createElement("div");
                    id = "color" + i;
                    color.setAttribute("id", id);
                    color.className = "color";
                    colorCode.className = "code";
                    colorCode.id = "code" + id;
                    if (i == 0) palette.insertBefore(color, palette.firstChild);
                    else palette.appendChild(color);
                    codes.appendChild(colorCode);
                    color = document.getElementById(id);                    
                    color.style.backgroundColor = colors[i];
                    colorCode.textContent = colors[i];

                    color.addEventListener("click", (event) => {
                        navigator.clipboard.writeText(
                            event.target.style.backgroundColor
                        );
                        code = document.getElementById(
                            "code" + event.target.id
                        );                        
                        code.textContent = "Copied!";
                        code.style.color = "white";
                        code.style.backgroundColor = "black";
                        code.style.opacity = "50%";
                        setTimeout(() => {
                            code.textContent = colors[parseInt((code.id).slice(-1))];
                            code.style.backgroundColor = "white";
                            code.style.color = "black";
                            code.style.opacity = "100%";
                            
                        }, 1000);
                    });
                }
            })
            .catch((error) =>
                console.error(
                    "There was a problem with the fetch operation:",
                    error
                )
            );
    });
    path.addEventListener("change", (e) => {
        pic = document.getElementsByClassName("picture")[0];
        if (pic.children.length != 0) {
            img = document.getElementsByClassName("img")[0];
            colors = document.getElementsByClassName("colors")[0];
            codes = document.getElementsByClassName("codes")[0];
            img.remove();
            colors.remove();
            codes.remove();
        }
        insertIMG();
    });
    function insertIMG() {
        const img = document.createElement("img");
        img.className = "img";
        selectedFile = path.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(selectedFile);
        reader.onload = () => {
            const imgData = reader.result;
            img.src = imgData;
            img.alt = selectedFile.name;
            picture.appendChild(img);
        };
    }
}
