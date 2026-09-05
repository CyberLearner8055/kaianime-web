async function test() {
  const extractUrl = 'http://localhost:3000/api/extract?url=' + encodeURIComponent('https://as-cdn26.top/video/dca7591c1e1d560ebf2d0e994c8a3392');
  const extractRes = await fetch(extractUrl);
  const data = await extractRes.json();

  const masterProxyUrl = 'http://localhost:3000/api/proxy?url=' + encodeURIComponent(data.streamUrl) + '&referer=' + encodeURIComponent(data.referer);
  console.log('1. Fetching Master Manifest:', masterProxyUrl);
  const masterRes = await fetch(masterProxyUrl);
  console.log('   Master status:', masterRes.status);
  const masterText = await masterRes.text();

  const lines = masterText.split('\n').map(l => l.trim());
  let audioUrl = null;
  let videoUrl = null;

  for (const l of lines) {
    if (l.includes('TYPE=AUDIO') && l.includes('URI="')) {
      const m = l.match(/URI="([^"]+)"/);
      if (m && !audioUrl) audioUrl = m[1];
    }
    if (l.startsWith('/api/proxy') && !videoUrl) {
      videoUrl = l;
    }
  }

  console.log('2. Audio URL found:', audioUrl);
  console.log('3. Video URL found:', videoUrl);

  if (videoUrl) {
    const vRes = await fetch('http://localhost:3000' + videoUrl);
    console.log('   Video variant status:', vRes.status);
    const vText = await vRes.text();
    console.log('   Video variant first 300 chars:\n', vText.slice(0, 300));
    
    // Check first chunk in video variant
    const chunkLine = vText.split('\n').map(l => l.trim()).find(l => l.startsWith('/api/proxy'));
    if (chunkLine) {
      console.log('   Testing video chunk fetch:');
      const cRes = await fetch('http://localhost:3000' + chunkLine);
      console.log('   Chunk status:', cRes.status, 'size:', (await cRes.arrayBuffer()).byteLength);
    }
  }

  if (audioUrl) {
    const aRes = await fetch('http://localhost:3000' + audioUrl);
    console.log('   Audio variant status:', aRes.status);
    const aText = await aRes.text();
    console.log('   Audio variant first 300 chars:\n', aText.slice(0, 300));

    const aChunkLine = aText.split('\n').map(l => l.trim()).find(l => l.startsWith('/api/proxy'));
    if (aChunkLine) {
      console.log('   Testing audio chunk fetch:');
      const acRes = await fetch('http://localhost:3000' + aChunkLine);
      console.log('   Audio chunk status:', acRes.status, 'size:', (await acRes.arrayBuffer()).byteLength);
    }
  }
}

test().catch(console.error);
