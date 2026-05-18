const http = require('http');
const querystring = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;

let isLoggedIn = false;
let loggedInUser = '';

const server = http.createServer((req, res) => {
  
  // Logic for Login POST
  if (req.method === 'POST' && req.url === '/login') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const formData = querystring.parse(body);
      isLoggedIn = true;
      loggedInUser = formData.username || 'User';
      res.statusCode = 302;
      res.setHeader('Location', '/');
      res.end();
    });
    return;
  }

  // Logic for Contact Form Submission
  if (req.method === 'POST' && req.url === '/contact') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const formData = querystring.parse(body);
      // Log the contact request directly to your CMD screen window
      console.log('New Design Request Received:', formData);
      res.statusCode = 302;
      res.setHeader('Location', '/?contact=success');
      res.end();
    });
    return;
  }

  // Logic for Google Auth Simulation
  if (req.url === '/auth/google') {
    isLoggedIn = true;
    loggedInUser = 'Lalit (Via Google Account)';
    res.statusCode = 302;
    res.setHeader('Location', '/');
    res.end();
    return;
  }

  // Logic for Logout
  if (req.url === '/logout') {
    isLoggedIn = false;
    loggedInUser = '';
    res.statusCode = 302;
    res.setHeader('Location', '/');
    res.end();
    return;
  }

  // Check for contact success parameter
  const contactSuccess = req.url.includes('contact=success');

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html'); 
  
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lalit Badgujar Services</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #121212; color: white; }
        
        /* Updated Navigation matching Odoo framework links */
        .navbar { display: flex; justify-content: space-between; align-items: center; background-color: #1a1a1a; padding: 15px 30px; border-bottom: 2px solid #333; }
        .logo { font-size: 1.4em; font-weight: bold; color: #00ff88; text-decoration: none; }
        .nav-links { display: flex; gap: 20px; align-items: center; }
        .nav-links a { color: #cccccc; text-decoration: none; font-weight: 500; transition: color 0.3s; cursor: pointer; font-size: 0.95em; }
        .nav-links a:hover { color: #00ff88; }
        
        .btn { border: none; padding: 9px 18px; font-weight: bold; border-radius: 5px; cursor: pointer; font-size: 0.9em; text-decoration: none; display: inline-block; }
        .login-btn { background-color: #00ff88; color: #121212; }
        .login-btn:hover { background-color: #00cc6e; }
        .logout-btn { background-color: #ff3333; color: white; }
        .logout-btn:hover { background-color: #cc2424; }
        
        .container { max-width: 900px; margin: 40px auto; padding: 0 20px; }
        
        /* Primary Banner - Copied directly from your Odoo site layout */
        h1 { color: #ffffff; font-size: 2.8em; margin-bottom: 10px; text-align: center; font-weight: 700; line-height: 1.2; }
        h1 span { color: #00ff88; }
        .subtitle { color: #aaaaaa; font-size: 1.25em; margin-bottom: 40px; text-align: center; }
        
        .home-contact-section { background-color: #1a1a1a; border: 2px solid #00ff88; border-radius: 10px; padding: 25px; margin-bottom: 35px; text-align: left; box-shadow: 0 4px 15px rgba(0,255,136,0.05); }
        .home-contact-section h2 { color: #00ff88; margin-top: 0; font-size: 1.4em; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px; }
        .contact-row { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 15px; }
        .contact-box { flex: 1; min-width: 180px; }
        .contact-box strong { color: #888; display: block; font-size: 0.8em; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .contact-box span { color: #ffffff; font-size: 1.1em; font-weight: 500; }
        .contact-box a { color: #00ff88; text-decoration: none; }
        .contact-box a:hover { text-decoration: underline; }

        .premium-banner { background-color: #1a1a1a; border: 1px solid #00ff88; border-radius: 8px; padding: 15px; margin-bottom: 25px; color: #00ff88; font-weight: bold; text-align: center; }
        .success-banner { background-color: #1a1a1a; border: 1px solid #00dd44; border-radius: 8px; padding: 15px; margin-bottom: 25px; color: #00dd44; font-weight: bold; text-align: center; }
        
        .embed-container {
            position: relative;
            width: 100%;
            height: 0;
            padding-top: 56.25%; 
            padding-bottom: 0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.6);
            margin-top: 1.6em;
            margin-bottom: 0.9em;
            overflow: hidden;
            border-radius: 8px;
            will-change: transform;
            background-color: #1a1a1a;
        }
        .embed-container iframe {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            border: none;
            padding: 0;
            margin: 0;
        }
        .design-link {
            font-size: 14px;
            color: #00ff88;
            text-decoration: none;
            display: block;
            text-align: center;
            margin-bottom: 40px;
        }
        .design-link:hover { text-decoration: underline; }
        
        .services-section { margin-bottom: 35px; }
        .services-section h2 { color: #00ff88; margin-bottom: 20px; text-align: center; font-size: 1.6em; }
        .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .service-card { background-color: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 25px; text-align: center; transition: all 0.3s; }
        .service-card:hover { border-color: #00ff88; box-shadow: 0 0 20px rgba(0,255,136,0.1); transform: translateY(-5px); }
        .service-card h3 { color: #00ff88; margin-bottom: 12px; }
        .service-card p { color: #aaa; font-size: 0.95em; line-height: 1.6; }

        /* Modal Elements */
        .modal { display: none; position: fixed; z-index: 100; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.8); overflow-y: auto; }
        .modal-content { background-color: #1a1a1a; margin: 8% auto; padding: 30px; border: 1px solid #333; width: 90%; max-width: 450px; border-radius: 8px; text-align: left; position: relative; }
        .close { position: absolute; right: 20px; top: 15px; color: #aaa; font-size: 24px; cursor: pointer; }
        .close:hover { color: white; }
        .modal-content h2 { margin-top: 0; color: #00ff88; margin-bottom: 20px; }
        
        .google-btn { display: flex; align-items: center; justify-content: center; width: 100%; background-color: white; color: #1f1f1f; border: 1px solid #747775; padding: 10px; font-weight: bold; border-radius: 4px; cursor: pointer; font-size: 0.95em; text-decoration: none; box-sizing: border-box; margin-bottom: 20px; }
        .google-btn:hover { background-color: #f2f2f2; }
        .google-icon { width: 18px; height: 18px; margin-right: 10px; vertical-align: middle; }
        
        .divider { display: flex; align-items: center; text-align: center; color: #777; margin-bottom: 20px; font-size: 0.85em; }
        .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid #333; }
        .divider:not(:empty)::before { margin-right: .5em; }
        .divider:not(:empty)::after { margin-left: .5em; }

        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; margin-bottom: 5px; color: #ccc; font-size: 0.9em; }
        .input-group input, .input-group textarea { width: 100%; padding: 10px; box-sizing: border-box; background: #2b2b2b; border: 1px solid #444; color: white; border-radius: 4px; font-family: inherit; }
        .input-group textarea { resize: vertical; min-height: 100px; }
        .submit-btn { width: 100%; background: #00ff88; color: #121212; border: none; padding: 10px; font-weight: bold; border-radius: 4px; cursor: pointer; }
        
        footer { margin-top: 60px; padding: 25px; border-top: 1px solid #222; text-align: center; color: #666; font-size: 0.9em; }
      </style>
    </head>
    <body>

      <!-- Top Navigation matching Odoo framework channels -->
      <div class="navbar">
        <a href="/" class="logo">Lalit Badgujar Services</a>
        <div class="nav-links">
          <a href="/">Home</a>
          <a onclick="openContactModal()">Contact Us</a>
          <a onclick="openContactModal()">Shop</a>
          ${isLoggedIn 
            ? `<a href="/logout" class="btn logout-btn">Logout</a>` 
            : `<button class="btn login-btn" onclick="openLoginModal()">Sign In</button>`
          }
        </div>
      </div>

      <div class="container">
        
        <!-- Reunified Header: Create Your Imagination With Our Editor -->
        <h1>Create Your <span>Imagination</span> With Our Editor.</h1>
        <p class="subtitle">Don't just present. Command the room with Lalit Services.</p>
        
        ${isLoggedIn ? `
          <div class="premium-banner">
            🔓 Welcome back, ${loggedInUser}! Odoo active session synchronization complete.
          </div>
        ` : ''}

        ${contactSuccess ? `
          <div class="success-banner">
            ✅ Request Submitted! Lalit Badgujar (Editor) will review your layout parameters shortly.
          </div>
        ` : ''}

        <!-- My Contacts Module Component -->
        <div class="home-contact-section">
          <h2>My Contacts</h2>
          <div class="contact-row">
            <div class="contact-box">
              <strong>Lead Specialist</strong>
              <span>Lalit Badgujar (Editor)</span>
            </div>
            <div class="contact-box">
              <strong>Support Email</strong>
              <span><a href="mailto:Lalitbadgujar66@gmail.com">Lalitbadgujar66@gmail.com</a></span>
            </div>
            <div class="contact-box">
              <strong>Hotline Support</strong>
              <span>+1 555-555-5556</span>
            </div>
            <div class="contact-box">
              <strong>Availability</strong>
              <span>Continuous Execution 24/7</span>
            </div>
          </div>
        </div>

        <!-- Canva Interactive Presentation Preview Layout -->
        <div class="embed-container">
          <iframe loading="lazy" src="https://canva.com" allowfullscreen="allowfullscreen" allow="fullscreen"></iframe>
        </div>
        <a class="design-link" href="https://canva.com" target="_blank" rel="noopener">Lalit Services Editor Preview — WELCOME TO</a>

        <!-- Core Offerings Grid Area -->
        <div class="services-section">
          <h2>Explore Categories & Services</h2>
          <div class="services-grid">
            <div class="service-card">
              <h3>Corporate Layouts</h3>
              <p>Turn raw content and assets into investment-ready, clean business presentation files.</p>
            </div>
            <div class="service-card">
              <h3>Custom Animations</h3>
              <p>Enhance audience retention with smooth transitions and cleanly timed visual elements.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Element aligned with your Odoo framework credits -->
      <footer>
        <p>Copyright © Lalit Badgujar Services. Powered by Odoo Engine & Node.js Server Environment.</p>
      </footer>

      <!-- The Sign In / Login Pop-Up Modal Component -->
      <div id="loginModal" class="modal">
        <div class="modal-content">
          <span class="close" onclick="closeLoginModal()">&times;</span>
          <h2>Sign In</h2>
          
          <a href="/auth/google" class="google-btn">
            <svg class="google-icon" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.437-2.882-6.437-6.437s2.882-6.437 6.437-6.437c1.574 0 3.012.574 4.12 1.518l2.977-2.977C18.995 2.1 15.815 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.126 0 11.214-4.446 11.214-11.24 0-.765-.067-1.503-.191-2.215H12.24z"/>
              <path fill="#4285F4" d="M23.263 10.285H12.24V14.4h6.887c-.318 1.182-1.002 2.193-1.895 2.915l2.946 2.288c1.722-1.59 2.714-3.93 2.714-6.845 0-.765-.067-1.503-.191-2.215z"/>
              <path fill="#FBBC05" d="M17.232 17.315c-1.31 1.2-3.084 1.915-4.992 1.915-3.555 0-6.437-2.882-6.437-6.437 0-.765.134-1.493.376-2.17L3.134 8.27A11.192 11.192 0 0 0 1 12.24c0 3.981 2.074 7.477 5.19 9.458l3.151-2.446c-.888-.521-1.636-1.24-2.109-2.093l10.001.156z"/>
              <path fill="#34A853" d="M12.24 4.714c1.574 0 3.012.574 4.12 1.518l2.977-2.977A11.163 11.163 0 0 0 12.24 1C6.033 1 1 6.033 1 12.24c0 .734.072 1.45.207 2.146l3.223-2.502a6.406 6.406 0 0 1-.207-1.884c0-3.555 2.882-6.437 6.437-6.437z"/>
            </svg>
            Sign in with Google
          </a>

          <div class="divider">or use local credentials</div>

          <form action="/login" method="POST">
            <div class="input-group">
              <label>Username or Email</label>
              <input type="text" name="username" required autocomplete="off">
            </div>
            <div class="input-group">
              <label>Password</label>
              <input type="password" name="password" required>
            </div>
            <button type="submit" class="submit-btn">Login to Editor Profile</button>
          </form>
        </div>
      </div>

      <!-- The Contact / Order Design Pop-Up Modal Component -->
      <div id="contactModal" class="modal">
        <div class="modal-content">
          <span class="close" onclick="closeContactModal()">&times;</span>
          <h2>Request PPT Design</h2>
          <form action="/contact" method="POST">
            <div class="input-group">
              <label>Your Name</label>
              <input type="text" name="name" required autocomplete="off">
            </div>
            <div class="input-group">
              <label>Email Address</label>
              <input type="email" name="email" required autocomplete="off">
            </div>
            <div class="input-group">
              <label>Project Specifications (Topic, Slides Count, Tone)</label>
              <textarea name="details" required placeholder="Describe your presentation needs..."></textarea>
            </div>
            <button type="submit" class="submit-btn" style="background: #00a8ff; color: white;">Submit Service Order</button>
          </form>
        </div>
      </div>

      <script>
        const loginModal = document.getElementById('loginModal');
        const contactModal = document.getElementById('contactModal');

        function openLoginModal() { loginModal.style.display = 'block'; }
        function closeLoginModal() { loginModal.style.display = 'none'; }

        function openContactModal() { contactModal.style.display = 'block'; }
        function closeContactModal() { contactModal.style.display = 'none'; }

        window.onclick = function(event) {
          if (event.target == loginModal) { loginModal.style.display = 'none'; }
          if (event.target == contactModal) { contactModal.style.display = 'none'; }
        }
      </script>

    </body>
    </html>
  `);
});

server.listen(port, hostname, () => {
  console.log(`Server running successfully at http://${hostname}:${port}/`);
});
