/** @jsx React.DOM */

//   FeatureList
//     Feature
//       - name
//       - status
//       - description
//       - button-edit
//       - button-delete
//       - toggle-status
//   FeatureForm

//    StrategyList
//      Strategy
//    StrategyForm

var FeatureList = React.createClass({
    getInitialState: function() {
        return {
            features: []
        };
    },

    componentDidMount: function () {
        reqwest('/features').then(this.setFeatures);
    },

    setFeatures: function (data) {
        this.setState({features: data.features});
    },

    updateFeature: function (changeRequest) {
        var newFeatures = this.state.features;
        newFeatures.forEach(function(f){
            if(f.name === changeRequest.name) {
                f[changeRequest.field] = changeRequest.value;
            }
        });
        console.log(changeRequest);
        reqwest({
            url: 'features/' + changeRequest.name,
            method: 'patch',
            type: 'json',
            contentType: 'application/json',
            data: JSON.stringify(changeRequest)
        }).then(function() {
            this.setState({features: newFeatures});
        }.bind(this), function() {
            alert("update failed");
        }.bind(this));
    },

    render: function () {
        var featureNodes = this.state.features.map(function (feature) {
            return (
                <Feature feature={feature} updateFeature={this.updateFeature} />
            );
        }.bind(this));

        return (
            <div className="mod shadow">
              <div className="inner">
                <div className="bd">
                  {featureNodes}
                </div>
              </div>
            </div>
        );
    }
});

var Feature = React.createClass({
    // TODO: validate props?
/*
    handleStatusChange: function (feature, event) {
        console.log(feature);
        console.log(event);
    },
*/
    handleEnableChange: function(event) {
        var feature = this.props.feature;
        this.props.updateFeature({
            name: feature.name,
            field: "enabled",
            value: event.target.checked
            });
    },

    render: function () {
        return (
            <div>
              <div className="line">
                <div className="unit r-size1of3">
                  <div className="mod">
                    <div className="inner">
                       <div className="bd">
                         <p>{this.props.feature.name}</p>
                         <p className="neutral">{this.props.feature.description}</p>

                       </div>
                    </div>
                  </div>
                </div>

                <div className="unit r-size1of3">
                  <div className="mod">
                    <div className="inner">
                       <div className="bd">
                         <p>
                           <label>
                              {this.props.feature.status}
                              <input
                                 type="checkbox"
                                 checked={this.props.feature.enabled}
                                 className="mll"
                                 onChange={this.handleEnableChange}
                              />
                           </label>
                         </p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="unit r-size1of3">
                  <div className="mod">
                    <div className="inner">
                       <div className="bd">
                         <button className="pam mtl mll">Edit</button>
                         <button className="pam mtl mll">Delete</button>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr />
            </div>
        );
    }
});


React.renderComponent(
    FeatureList(null),
    document.getElementById('content')
);