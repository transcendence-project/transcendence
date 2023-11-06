<template>
	<div class="not">
	  <h2>Page Not Found</h2>
	  <div class="not-msg">
		The page didn't exist
	  </div>
	</div>
  </template>
  
  <style scoped>
  .not {
	display: flex;
	flex-direction: column;
	align-items: center;
	background: linear-gradient(to right, #451952, #451952, #ae4188);
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.5);
	margin: 20px;
	padding: 20px;
	border-radius: 5px;
	width: 100%;
	height: 100%;
	color: white;
  }
  
  .std-msg {
	padding: 0;
	width: 100%;
	margin: 0;
	text-align: center;
  }
  

  
  @media screen and (max-width: 768px) {
	.std-title,
	.std-list {
	  flex-direction: column;
	}
  }
  </style>
  