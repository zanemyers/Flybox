import axios from "axios";

async function testLlama3Summarization() {
  try {
    const prompt = `Summarize the following:\n\nThe river was flowing steadily after recent rains. Anglers had success using small black and olive streamers. The water was slightly stained, but fish activity was strong.`;

    const response = await axios.post(`http://localhost:11434/api/generate`, {
      model: "llama3",
      prompt,
      stream: false,
    });

    console.log("\n✅ Llama3 Summary:\n");
    console.log(response.data.response.trim());
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testLlama3Summarization();
