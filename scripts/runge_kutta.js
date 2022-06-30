
var m = 1
var c = 0.1
var k = 2
var a1 = 1
var a2 = 2
var a3 = 1.5
var w1 = 0.05
var w2 = 1
var w3 = 2
var total_time = 3
var step = 0.1


$(() => {

    $('#m').load('input', function() {
        this.value = m
    })
    $('#m').bind('input propertychange', function() {
        m = parseFloat(this.value)
    })
    $('#c').load('input', function() {
        this.value = c
    })
    $('#c').bind('input propertychange', function() {
        c = parseFloat(this.value)
    })
    $('#k').load('input', function() {
        this.value = k
    })
    $('#k').bind('input propertychange', function() {
        k = parseFloat(this.value)
    })
    $('#a1').load('input', function() {
        this.value = a1
    })
    $('#a1').bind('input propertychange', function() {
        a1 = parseFloat(this.value)
    })
    $('#a2').load('input', function() {
        this.value = a2
    })
    $('#a2').bind('input propertychange', function() {
        a2 = parseFloat(this.value)
    })
    $('#a3').load('input', function() {
        this.value = a3
    })
    $('#a3').bind('input propertychange', function() {
        a3 = parseFloat(this.value)
    })
    $('#w1').load('input', function() {
        this.value = w1
    })
    $('#w1').bind('input propertychange', function() {
        w1 = parseFloat(this.value)
    })
    $('#w2').load('input', function() {
        this.value = w2
    })
    $('#w2').bind('input propertychange', function() {
        w2 = parseFloat(this.value)
    })
    $('#w3').load('input', function() {
        this.value = w3
    })
    $('#w3').bind('input propertychange', function() {
        w3 = parseFloat(this.value)
    })
    $('#integration-step').load('input', function() {
        this.value = step
    })

    $('#integration-step').bind('input propertychange', function() {
        step = parseFloat(this.value)
    })
    $('#total-time-integration').load('input', function() {
        this.value = total_time
    })
    $('#total-time-integration').bind('input propertychange', function() {
        total_time = parseFloat(this.value)
    })

    $('#solve').click(function() {
        redraw_result_table()
        var moments = runge_kutta(m,c,k,a1,a2,a3,w1,w2,w3, step, total_time)
        draw_result_x(moments)
    })
    
    function f(m,c,k,a1,a2,a3,w1,w2,w3,t){
        return a1*Math.sin(w1*t) + a2*Math.sin(w2*t) + a3*Math.cos(w3*t)
    }

    function f_derivative(m,c,k,a1,a2,a3,w1,w2,w3, t, x, dx){
        return (f(m,c,k,a1,a2,a3,w1,w2,w3,t) - c*dx - k*x)/m
    }

    function runge_kutta(m,c,k,a1,a2,a3,w1,w2,w3,step, total_time){
        var dy=0, y=0, t = 0
        var half_step = step / 2
        // t = tempo, y = deslocamento, dy = velocidade, dyy = aceleração
        var t0_moment = {'tempo': t, 'deslocamento': y, 'velocidade': dy, 'aceleracao': f_derivative(m,c,k,a1,a2,a3,w1,w2,w3,t, y, dy)} 
        var moments = [t0_moment]
        for (var i = 0; i < parseInt(total_time / step); i++) {
            var K1 = half_step * f_derivative(m,c,k,a1,a2,a3,w1,w2,w3,t, y, dy)
            var Q = half_step * (dy+1/2*K1)
            var K2 = half_step * f_derivative(m,c,k,a1,a2,a3,w1,w2,w3,t+half_step, y+Q, dy+K1)
            var K3 = half_step * f_derivative(m,c,k,a1,a2,a3,w1,w2,w3,t+half_step, y+Q, dy+K2)
            var L = half_step*(dy+K3)
            var K4 = half_step * f_derivative(m,c,k,a1,a2,a3,w1,w2,w3,t+step, y+L, dy+2*K3)

            // now increment Y, Y' and T
            y += half_step*(dy+(1/3)*(K1+K2+K3))
            dy += 1/3*(K1+2*K2+2*K3+K4)
            t += step
            moments.push({'tempo': t, 'deslocamento': y, 'velocidade': dy, 'aceleracao': f_derivative(m,c,k,a1,a2,a3,w1,w2,w3,t, y, dy)})
        }
        return moments 
    }

    function redraw_result_table(){
        $('#vector-x-table-body').empty()
        $('#vector-x-table-head').empty()
        $('#vector-x-table-head').append('<tr><th>Iter</th><th>Time</th><th>Position</th><th>Speed</th><th>Aceleration</th></tr>')
    }

    function draw_result_x(moments){
        for(let i = 0; i < moments.length; i++){
            $('#vector-x-table-body').append('<tr id="vector-x-row'+i+'">')
            $('#vector-x-row'+i).append('<td>'+i+'</td>')
            $('#vector-x-row'+i).append('<td>'+moments[i].tempo+'</td>')
            $('#vector-x-row'+i).append('<td>'+moments[i].deslocamento+'</td>')
            $('#vector-x-row'+i).append('<td>'+moments[i].velocidade+'</td>')
            $('#vector-x-row'+i).append('<td>'+moments[i].aceleracao+'</td>')
            $('#vector-x-table-body').append('</tr>')

        }
        
    }

}
)
