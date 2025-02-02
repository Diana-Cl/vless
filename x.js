case `/${userCode}`: {
    const streamConfig = getDianaConfig(userCode, request.headers.get('Host'));
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Proxy Configurations</title>
        <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                background: #f8f9fa;
                color: #333;
                padding: 20px;
            }

            .container {
                max-width: 800px;
                margin: 0 auto;
            }

            .header {
                text-align: center;
                padding: 2rem 0;
                border-bottom: 1px solid #eee;
                margin-bottom: 2rem;
            }

            .title {
                color: #2b6cb0;
                font-size: 2.2rem;
                margin-bottom: 0.5rem;
            }

            .config-card {
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 1.5rem;
                overflow: hidden;
            }

            .card-header {
                padding: 1rem 1.5rem;
                background: #f7fafc;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .card-title {
                color: #2d3748;
                font-size: 1.1rem;
                font-weight: 600;
            }

            .copy-btn {
                background: #4299e1;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                cursor: pointer;
                transition: background 0.2s;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .copy-btn:hover {
                background: #3182ce;
            }

            .copy-btn:active {
                background: #2b6cb0;
            }

            .config-content {
                padding: 1.5rem;
                position: relative;
            }

            .config-text {
                font-family: 'SFMono-Regular', Consolas, monospace;
                font-size: 0.9rem;
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 6px;
                overflow-x: auto;
                white-space: pre-wrap;
                word-break: break-all;
            }

            .note {
                text-align: center;
                color: #718096;
                margin-top: 2rem;
                font-size: 0.9rem;
            }

            @media (max-width: 640px) {
                .container {
                    padding: 0 15px;
                }
                
                .config-text {
                    font-size: 0.8rem;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <header class="header">
                <h1 class="title">Proxy Configurations</h1>
                <p>Generated for ${request.headers.get('Host')}</p>
            </header>
            
            <div id="config-container"></div>
            
            <p class="note">Click the copy button to use configuration</p>
        </div>

        <script>
            const parseConfig = (text) => {
                const sections = [];
                const rawSections = text.split(/\\n⁑{10,}/).filter(s => s.trim());
                
                rawSections.forEach(section => {
                    const lines = section.split('\\n').filter(l => l.trim());
                    const title = lines[0].replace(/\*/g, '').trim();
                    const content = lines.slice(2).join('\\n').trim();
                    
                    if(title && content) {
                        sections.push({ 
                            title: title.replace(/[⁑*]/g, ''),
                            content: content.replace(/[⁑*]/g, '') 
                        });
                    }
                });
                
                return sections;
            };

            const createCard = (section) => {
                const card = document.createElement('div');
                card.className = 'config-card';
                
                const header = document.createElement('div');
                header.className = 'card-header';
                
                const title = document.createElement('h2');
                title.className = 'card-title';
                title.textContent = section.title;
                
                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-btn';
                copyBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M8 4v12h12V4H8zM6 2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
                    </svg>
                    Copy
                `;
                
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(section.content)
                        .then(() => {
                            copyBtn.textContent = 'Copied!';
                            setTimeout(() => {
                                copyBtn.innerHTML = `
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M8 4v12h12V4H8zM6 2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
                                    </svg>
                                    Copy
                                `;
                            }, 1500);
                        })
                        .catch(err => console.error('Copy failed:', err));
                };

                header.appendChild(title);
                header.appendChild(copyBtn);
                
                const contentDiv = document.createElement('div');
                contentDiv.className = 'config-content';
                const pre = document.createElement('pre');
                pre.className = 'config-text';
                pre.textContent = section.content;
                
                contentDiv.appendChild(pre);
                card.appendChild(header);
                card.appendChild(contentDiv);
                
                return card;
            };

            // Parse and render configurations
            const configData = parseConfig(${JSON.stringify(streamConfig)});
            const container = document.getElementById('config-container');
            
            configData.forEach(config => {
                container.appendChild(createCard(config));
            });
        </script>
    </body>
    </html>
    `;
    
    return new Response(html, {
        status: 200,
        headers: { 
            "Content-Type": "text/html;charset=utf-8",
            "Cache-Control": "no-store, max-age=0" 
        },
    });
}
