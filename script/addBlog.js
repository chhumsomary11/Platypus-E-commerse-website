
//Blogs list
let blogs = [
  {
    img: "image/blog4.jpg",
    title: "Meet Chhumsomary Loeung",
    sub_title: "The founder of Platypus",
    description: `Chhumsomary Loeung is the visionary co-founder of Platypus, 
    a women-led clothing brand built on the belief that fashion should be more than just beautiful — it should be empowering. 
    With a deep passion for creativity and a strong connection to her Cambodian roots, 
    she strives to design collections that celebrate individuality, confidence, and authenticity. 
    Through Platypus, Chhumsomary aims to inspire women to embrace their unique identities 
    and express themselves  through everyday wear that feels as good as it looks.`
  },
  {
  img: "image/blog5.jpg",
  title: "How Our Community is Shaping Modern Style",
  sub_title: "Empowering authentic expression through shared fashion",
  description: `Fashion isn’t just about individual choices — it’s a reflection of community, culture, and connection. 
  In this blog, we celebrate how our vibrant community of women is influencing modern style by embracing authenticity, diversity, and confidence. 
  Together, we’re redefining what it means to dress with purpose — supporting each other to express unique identities while honoring shared values. 
  Discover how community-driven style inspires new trends rooted in culture, inclusivity, and empowerment, and why being part of this movement means more than just wearing clothes — it means belonging.`
}

];


//take the empty container

let blogContainer= document.querySelector(".blog-container");

// initialize an empty space for the blog container

let content ="";

//loop over

for (let i=0; i<blogs.length;i++){
    content += `
    <div class="row p-4">
          <div class="blog-img col-md-6">
            <img class="img-fluid" src="${blogs[i].img}" alt="background" />
          </div>
          <div
            class="blog-info col-md-6 d-flex flex-column justify-content-center"
          >
            <h1>${blogs[i].title}</h1>
            <p style="font-size: 12">
              ${blogs[i].sub_title} <br />
             ${blogs[i].description}
            </p>
          </div>
        </div>`
}

blogContainer.innerHTML = content;