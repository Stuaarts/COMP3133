const mongoose = require('mongoose');

function buildUserModelWithValidation() {
  const GeographicalSchema = new mongoose.Schema(
    {
      lat: {
        type: String,
        required: [true, 'Latitude is required']
      },
      lng: {
        type: String,
        required: [true, 'Longitude is required']
      }
    },
    { _id: false }
  );

  const AddressSchema = new mongoose.Schema(
    {
      street: {
        type: String,
        required: [true, 'Street is required']
      },
      suite: {
        type: String,
        required: [true, 'Suite is required']
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        validate: {
          validator: (cityName) => /^[A-Za-z\s]+$/.test(cityName),
          message: 'City name may contain only letters and spaces'
        }
      },
      zipcode: {
        type: String,
        required: [true, 'Zip code is required'],
        validate: {
          validator: (zipValue) => /^\d{5}-\d{4}$/.test(zipValue),
          message: 'Zip code must follow the 12345-1234 format'
        }
      },
      geo: {
        type: GeographicalSchema,
        required: true
      }
    },
    { _id: false }
  );

  const CompanySchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'Company name is required']
      },
      catchPhrase: {
        type: String,
        required: [true, 'Company catch phrase is required']
      },
      bs: {
        type: String,
        required: [true, 'Company business description is required']
      }
    },
    { _id: false }
  );

  const UserSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'Name is required']
      },
      username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [4, 'Username must be at least 4 characters'],
        maxlength: [100, 'Username must be at most 100 characters']
      },
      email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
        lowercase: true,
        validate: {
          validator: (emailValue) => /^\S+@\S+\.\S+$/.test(emailValue),
          message: 'Email address must be a valid email'
        }
      },
      address: {
        type: AddressSchema,
        required: true
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
          validator: (phoneValue) => /^1-\d{3}-\d{3}-\d{4}$/.test(phoneValue),
          message: 'Phone must follow the 1-123-123-1234 format'
        }
      },
      website: {
        type: String,
        required: [true, 'Website URL is required'],
        validate: {
          validator: (websiteValue) =>
            /^https?:\/\/[\w\-]+(\.[\w\-]+)+.*$/i.test(websiteValue),
          message: 'Website must be a valid http or https URL'
        }
      },
      company: {
        type: CompanySchema,
        required: true
      }
    },
    {
      timestamps: true
    }
  );

  return mongoose.models.User || mongoose.model('User', UserSchema);
}

module.exports = {
  buildUserModelWithValidation
};
