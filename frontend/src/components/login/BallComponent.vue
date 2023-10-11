<template>
    <div class="center">
        <div class="shadow"></div>
        <div class="ball"></div>
    </div>
</template>


<style scoped>
.center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-505,-50%);
}

.ball {
    position: absolute;
    width: 50px;
    height: 50px;
    background-color: #fff;
    border-radius: 50%;
    transform: translate(-50%,-50%);
    animation: animate 1.5s linear infinite;
}
.shadow {
    position: absolute;
    width: 100px;
    height: 50px;
    transform: translate(-50%,-50%);
    background: rgba(0, 0, 0, .2);
    border-radius: 50%;
    z-index: -1;
    filter: blur(2px);
    animation: shadow 1.5s linear infinite;
}

@keyframes shadow
{
    0%{
        transform: translate(-50%,100%) scale(0.5);
    }
    50% {
        transform: translate(-50%,100%) scale(1);
    }
    100% {  
        transform: translate(-50%,100%) scale(0.5);
    }
}

@keyframes animate
{
    0%{
        transform: translate(-50%,-50%) translateY(-200px);
    }
    50% {
        transform: translate(-50%,50%) translateY(0px);
    }
    100% {  
        transform: translate(-50%,-50%) translateY(-200px);
    }
}
</style>