const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('http://localhost:5000/api/proxy/embed?url=' + encodeURIComponent('https://ai.adyapan.com/admin-login'));
    console.log('STATUS:', res.status);
    const links = res.data.match(/<link[^>]+stylesheet[^>]+>/g) || [];
    console.log('Rewritten Stylesheets:', links);
    const scripts = res.data.match(/<script[^>]+src=[^>]+>/g) || [];
    console.log('Rewritten Scripts:', scripts.slice(0, 3));
  } catch (e) {
    console.log('Error:', e.message);
  }
}

test();
