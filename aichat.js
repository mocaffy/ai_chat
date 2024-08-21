import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";
import { fetchChat } from "./fetchChat.js";
import { fetchConversation } from "./fetchConversation.js";
import { fetchConversationWithKanko } from "./fetchConversationWithKanko.js";
import { fetchConversationByModel } from "./fetchConversationByModel.js";
import { getModels } from "./openai.js";

Deno.serve(async (request) => {
  const pathname = new URL(request.url).pathname;

  if (request.method === "POST" && pathname === "/api/conversation") {
    const param = await request.json();
    console.log(param)
    const res = await fetchConversation(param);
    return new Response(res);
  }

  if (request.method === "POST" && pathname === "/api/conversation-kanko") {
    const param = await request.json();
    const res = await fetchConversationWithKanko(param);
    return new Response(res);
  }

  if (request.method === "POST" && pathname === "/api/conversation-ichigo") {
    const param = await request.json();
    const res = await fetchConversationByModel(
      "ft:gpt-3.5-turbo-0613:jig-jp::7r27I7v8",
      param,
    );
    return new Response(res);
  }

  if (request.method === "POST" && pathname === "/api/models") {
    const res = await getModels();
    return new Response(res);
  }

  if (request.method === "POST" && pathname === "/api/imagerecog") {
    const param = await request.json();
    const res = await fetchImageRecog(param.imgbin, param.prompt);
    return new Response(res);
  }

  if (request.method === "POST" && pathname === "/api/speech") {
    const param = await request.json();
    const res = await fetchSpeech(param.txt, {
      voice: param.voice,
      speed: param.speed,
    });
    return new Response(res);
  }

  if (request.method === "POST" && pathname === "/api") {
    const param = await request.json();
    const res = await fetchChat(param);
    return new Response(res);
  }

  return serveDir(request, {
    fsRoot: "./static/",
    urlRoot: "",
    enableCors: true,
  });
});
