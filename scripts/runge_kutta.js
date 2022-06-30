
var m = 0
var c = 0
var k = 0
var a1 = 0
var a2 = 0
var a3 = 0
var w1 = 0
var w2 = 0
var w3 = 0
var total_time = 0
var step = 0


$(() => {

    $('#m').bind('input propertychange', function() {
        m = parseFloat(this.value)
    })

    $('#c').bind('input propertychange', function() {
        c = parseFloat(this.value)
    })

    $('#k').bind('input propertychange', function() {
        k = parseFloat(this.value)
    })
    $('#a1').bind('input propertychange', function() {
        a1 = parseFloat(this.value)
    })
    $('#a2').bind('input propertychange', function() {
        a2 = parseFloat(this.value)
    })
    $('#a3').bind('input propertychange', function() {
        a3 = parseFloat(this.value)
    })
    $('#w1').bind('input propertychange', function() {
        w1 = parseFloat(this.value)
    })
    $('#w2').bind('input propertychange', function() {
        w2 = parseFloat(this.value)
    })
    $('#w3').bind('input propertychange', function() {
        w3 = parseFloat(this.value)
    })

    $('#integration-step').bind('input propertychange', function() {
        step = parseFloat(this.value)
    })

    $('#total-time-integration').bind('input propertychange', function() {
        total_time = parseFloat(this.value)
    })

    $('#solve').click(function() {
        console.log(solve(m,c,k,a1,a2,a3,w1,w2,w3))
    })
    
    function f(m,c,k,a1,a2,a3,w1,w2,w3,t){
        return a1*Math.sin(w1*t) + a2*Math.sin(w2*t) + a3*Math.cos(w3*t)
    }

    function f_derivative(m,c,k,a1,a2,a3,w1,w2,w3, t, x, dx){
        return (f(m,c,k,a1,a2,a3,w1,w2,w3,t) - c*dx - k*x)/m
    }

    function runge_kutta(m,c,k,a1,a2,a3,w1,w2,w3,step, total_time){
        dy = y = t = 0
        half_step = step / 2
        // t = tempo, y = deslocamento, dy = velocidade, dyy = aceleração
        t0_moment = {'tempo': t, 'deslocamento': y, 'velocidade': dy, 'aceleracao': f_derivative(m,c,k,a1,a2,a3,w1,w2,w3,t, y, dy)} 
        moments = [t0_moment]
        for (var i = 0; i < parseInt(total_time / step); i++) {
            K1 = half_step * f_derivative(m,c,k,a1,a2,a3,w1,w2,w3,t, y, dy)
            Q = half_step * (dy+1/2*K1)
            K2 = half_step * f_derivative(m,c,k,a1,a2,a3,w1,w2,w3,t+half_step, y+Q, dy+K1)
            K3 = half_step * f_derivative(m,c,k,a1,a2,a3,w1,w2,w3,t+half_step, y+Q, dy+K2)
            L = half_step*(dy+K3)
            K4 = half_step * f_derivative(m,c,k,a1,a2,a3,w1,w2,w3,t+step, y+L, dy+2*K3)

            // now increment Y, Y' and T
            y += half_step*(dy+(1/3)*(K1+K2+K3))
            dy += 1/3*(K1+2*K2+2*K3+K4)
            t += step
            moments.push({'tempo': t, 'deslocamento': y, 'velocidade': dy, 'aceleracao': f_derivative(m,c,k,a1,a2,a3,w1,w2,w3,t, y, dy)})
        }
        return moments 
    }

}
)
