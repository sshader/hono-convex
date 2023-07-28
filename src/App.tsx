import { FormEvent, useState } from "react";

export default function App() {
  const [newMessageText, setNewMessageText] = useState("");

  const convexDeploymentUrl = import.meta.env.VITE_CONVEX_URL;
  const convexSiteUrl = convexDeploymentUrl.endsWith(".cloud")
    ? convexDeploymentUrl.substring(
        0,
        convexDeploymentUrl.length - ".cloud".length
      ) + ".site"
    : convexDeploymentUrl;

  const [name, setName] = useState(() => Math.floor(Math.random() * 10000));
  const [authorNumber, setAuthorNumber] = useState(name);
  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();
    setNewMessageText("");
    const response = await fetch(`${convexSiteUrl}/api/postMessage`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        body: newMessageText,
        author: `User ${name.toString()}`,
      }),
    });
    const responseText = await response.text();
    window.alert(`Response: ${responseText}`);
  }

  async function handleListMessages(event: FormEvent) {
    event.preventDefault();
    const response = await fetch(
      `${convexSiteUrl}/api/listMessages/${authorNumber}`
    );
    const responseText = await response.text();
    window.alert(`Response: ${responseText}`);
  }

  return (
    <main>
      <h1>Convex Chat</h1>
      <div className="card">
        <h2>Messages can be sent and read via curl:</h2>
        <p>
          Try clicking the buttons to make the requests, or copy paste the curl
          commands into a terminal!
        </p>
      </div>
      <div className="card">
        <div>Send a message:</div>
        <div className="request">
          {`curl \\
  -H 'Content-Type: application/json' \\
  -d '{
      "author": "User ${name}",
      "body": "${newMessageText}"
    }' \\
  ${convexSiteUrl}/api/postMessage`}
        </div>
        <form onSubmit={handleSendMessage}>
          <div>
            User
            <input
              value={name}
              onChange={(event) => setName(parseInt(event.target.value))}
            />
          </div>
          <input
            value={newMessageText}
            onChange={(event) => setNewMessageText(event.target.value)}
            placeholder="Write a message…"
          />
          <input type="submit" value="Send" disabled={!newMessageText} />
        </form>
      </div>
      <div className="card">
        <div>
          <div>Read messages:</div>
          <div className="request">
            {`curl ${convexSiteUrl}/api/listMessages/${authorNumber}`}
          </div>
        </div>
        <form onSubmit={handleListMessages}>
          <div>
            User
            <input
              value={authorNumber}
              onChange={(event) =>
                setAuthorNumber(parseInt(event.target.value))
              }
            />
          </div>
          <input type="submit" value="List messages from author" />
        </form>
      </div>
    </main>
  );
}
