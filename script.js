document.addEventListener('DOMContentLoaded', () => {
    const receivedMessageDiv = document.getElementById('receivedMessage');
    const senderPortSpan = document.getElementById('senderPort');
    const statusMessageDiv = document.getElementById('statusMessage');

    const websocketUrl = 'ws://localhost:8081'; // Assuming WebSocket server runs on port 8081
    let ws;

    function connectWebSocket() {
        ws = new WebSocket(websocketUrl);

        ws.onopen = () => {
            displayStatus('Connected to WebSocket server.', 'success');
            console.log('WebSocket connected.');
        };

        ws.onmessage = (event) => {
            console.log('Message from server:', event.data);
            try {
                const data = JSON.parse(event.data);
                if (data.message) {
                    receivedMessageDiv.textContent = data.message;
                }
                if (data.port) {
                    senderPortSpan.textContent = data.port;
                }
                displayStatus('Message received and displayed.', 'success');
            } catch (e) {
                console.error('Error parsing message:', e);
                receivedMessageDiv.textContent = event.data; // Display raw data if not JSON
                senderPortSpan.textContent = 'N/A';
                displayStatus('Received non-JSON message or parsing error.', 'error');
            }
        };

        ws.onclose = (event) => {
            console.log('WebSocket disconnected:', event);
            displayStatus(`Disconnected from WebSocket server. Code: ${event.code}, Reason: ${event.reason}. Reconnecting in 5 seconds...`, 'error');
            setTimeout(connectWebSocket, 5000);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            displayStatus('WebSocket error. Check console for details.', 'error');
            ws.close();
        };
    }

    function displayStatus(message, type) {
        statusMessageDiv.textContent = message;
        statusMessageDiv.className = `status-message ${type}`;
    }

    connectWebSocket();
});