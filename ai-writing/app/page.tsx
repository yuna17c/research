import Image from "next/image";
import Autocomplete from "../components/AutoComplete";
import "./style_main.css";
import Head from "next/head";

export default function Home() {
  return (
   <>
    <Head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');
      </style>
    </Head>
    <main>
      <div className="title">
        <h1>Instructions: Tab to accept suggestions. Continue writing to ignore suggestions. Ctrl+Enter to regenerate recommendation.</h1>
        <h1>Task: ___</h1>
      </div>
      
      <div className="container">
        <Autocomplete />
      </div>
      <div className="submit">
        <button className="submit-button">submit</button>
      </div>
    </main>
    </>
  );
}
