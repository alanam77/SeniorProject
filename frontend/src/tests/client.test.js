import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import user from '@testing-library/user-event';
import Login from '../components/Login/index.jsx';
import { BrowserRouter } from "react-router-dom";
import axios from 'axios';
import CreateListing from '../scenes/CreateListing/index.jsx';
import UserProfile from '../scenes/UserProfile/index.jsx';
import UserListingCard from "../components/UserListingCard/UserProfileCard.jsx";
import EditForm from "../scenes/EditListing/index.jsx";
import ViewListing from "../scenes/ViewListing/index.jsx";
import Signup from "../components/SignUp/index.jsx";

jest.mock('axios');

describe('Test Sign Up Component', () => {
  test('Renders Signup component properly without crashing', () => {
    render(<BrowserRouter><Signup /></BrowserRouter>);
    expect(screen.getByTestId('fName')).toBeInTheDocument();
    expect(screen.getByTestId('lName')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByTestId('sub-btn')).toBeInTheDocument();
  });

  test('Form data is updated correctly when the user types into the input fields', () => {
    render(<BrowserRouter><Signup /></BrowserRouter>);
    fireEvent.change(screen.getByTestId('fName'), { target: { value: 'John' } });
    fireEvent.change(screen.getByTestId('lName'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByTestId('email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'password123' } });
    expect(screen.getByTestId('fName')).toHaveValue('John');
    expect(screen.getByTestId('lName')).toHaveValue('Doe');
    expect(screen.getByTestId('email')).toHaveValue('john.doe@example.com');
    expect(screen.getByTestId('password')).toHaveValue('password123');
  });

  test('Submits the form with valid data', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Success' } });
    render(<BrowserRouter><Signup /></BrowserRouter>);

    const firstName = screen.getByTestId('fName');
    const lastName = screen.getByTestId('lName');
    const email = screen.getByTestId('email');
    const password = screen.getByTestId('password');
    const submitBtn = screen.getByTestId('sub-btn');

    fireEvent.change(firstName, { target: { value: 'John' } });
    fireEvent.change(lastName, { target: { value: 'Doe' } });
    fireEvent.change(email, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(password, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);
    
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/users', {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    });
  });

  test('Error state is updated correctly when there is an error in form submission', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { message: 'Invalid Input' }, status: 400 } });
    render(<BrowserRouter><Signup /></BrowserRouter>);
    fireEvent.submit(screen.getByTestId('sub-btn'));
    const error = await screen.findByText('Invalid Input');
    expect(error).toBeInTheDocument();
  });
});

describe('Test Login Component', () => {
  test('Properly renders login form', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);

    expect(screen.getByText('Login to Your Account')).toBeInTheDocument();

    const email = screen.getByTestId('email');
    const password = screen.getByTestId('password');
    const sign_in = screen.getByTestId('sign-in-btn');
    const sign_up = screen.getByTestId('sign-up-btn');

    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(sign_in).toBeInTheDocument();
    expect(sign_up).toBeInTheDocument();
  });

  test('Test successful login', async () => {
    render(<BrowserRouter><Login /></BrowserRouter>);

    const email = screen.getByTestId('email');
    const password = screen.getByTestId('password');
    const sign_in = screen.getByTestId('sign-in-btn');

    const mockToken = "test-token";
    const mockResponse = { data: mockToken };
    axios.post.mockResolvedValueOnce({ data: mockResponse });

    user.click(email);
    user.keyboard('test@test.com');

    user.click(password);
    user.keyboard('test1!');

    user.click(sign_in);

    expect(axios.post).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(window.location.pathname).toBe('/login');
    });
  });

  test('Displays error message on unsuccessful login', async () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    const errorResponse = {
      response: {
        status: 401,
        data: {
          message: 'Invalid Email or Password',
        },
      },
    };

    axios.post.mockRejectedValue(errorResponse);

    const email = screen.getByTestId('email');
    const password = screen.getByTestId('password');
    const sign_in = screen.getByTestId('sign-in-btn');

    user.click(email);
    user.keyboard('test@test.com');

    user.click(password);
    user.keyboard('test1!');

    user.click(sign_in);

    await waitFor(() => {
      const errorMessage = screen.getByText('Invalid Email or Password');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});

describe('Test Create Listing Component', () => {
  test('Renders create listing component without crashing with form fields initially empty', () => {
    render(<BrowserRouter><CreateListing /></BrowserRouter>);

    const nameInput = screen.getByTestId('name');
    const priceInput = screen.getByTestId('price');
    const descriptionInput = screen.getByTestId('desc');
    const conditionSelect = screen.getByTestId('cond');
    const imageInput = screen.getByTestId('image');

    expect(nameInput.value).toBe('');
    expect(priceInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
    expect(conditionSelect.value).toBe('');
    expect(imageInput.value).toBe('');
  });

  test('Updates the name state when the name input field changes', () => {
    render(<BrowserRouter><CreateListing /></BrowserRouter>);
    const nameInput = screen.getByTestId('name');
    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    expect(nameInput).toHaveValue('Test Product');
  });

  test('Adds tags to the tags state when the Add button is clicked', async () => {
    render(<BrowserRouter><CreateListing /></BrowserRouter>);
    const tagSelect = screen.getByTestId('tags');
    const addTagButton = screen.getByTestId('add-btn');

    fireEvent.change(tagSelect, { target: { value: 'CSCI' } });
    expect(addTagButton).toBeEnabled();
    fireEvent.click(addTagButton);

    const list = screen.getByRole("list");
    expect(list).toHaveTextContent('CSCI');
  });

  test('Removes tags from the tags state when the Remove button is clicked', () => {
    render(<BrowserRouter><CreateListing /></BrowserRouter>);
    const tagSelect = screen.getByTestId('tags');
    const addTagButton = screen.getByTestId('add-btn');

    fireEvent.change(tagSelect, { target: { value: 'CSCI' } });
    fireEvent.click(addTagButton);

    const list = screen.getByRole("list");
    const removeTagButton = screen.getByTestId('remove-btn');

    expect(removeTagButton).toBeEnabled();
    fireEvent.click(removeTagButton);
    expect(list).toHaveTextContent('');
  });


  test('Handles form submit', async () => {
    const mockResponse = { data: { message: 'Listing created successfully' } };
    axios.post.mockResolvedValue(mockResponse);

    render(<BrowserRouter><CreateListing /></BrowserRouter>);
    const submitButton = screen.getByTestId('sub-btn');
    fireEvent.click(submitButton);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/listings', { "condition": "", "description": "", "image": "", "name": "", "price": "", "tags": [] }, expect.any(Object));
  });
});

describe('Test User Profile Component', () => {
  const user = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };

  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: user })
  });

  test('Renders without crashing', () => {
    render(<BrowserRouter><UserProfile /></BrowserRouter>);
  });

  test('Displays user info', async () => {
    render(<BrowserRouter><UserProfile /></BrowserRouter>);

    expect(await screen.findByText(`${user.firstName} ${user.lastName}`)).toBeInTheDocument();
    expect(screen.getByText(`Email: ${user.email}`)).toBeInTheDocument();
  });

  test('Displays Create Listing button', async () => {
    render(<BrowserRouter><UserProfile /></BrowserRouter>);

    const createButton = await screen.findByTestId('create-btn');
    expect(createButton).toBeInTheDocument();
    expect(createButton).toBeEnabled();
  });
});

describe('Test User Listing Card Component', () => {
  const props = {
    userId: 'user123',
    Id: 'listing123',
    title: 'Test Listing',
    price: '9.99',
    description: 'This is a test listing',
    condition: 'Good',
    image: 'test.jpg',
    tags: ['test', 'listing'],
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { firstName: 'John', lastName: 'Doe' } });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Renders listing title and price', () => {
    render(<BrowserRouter><UserListingCard {...props} /></BrowserRouter>);
    expect(screen.getByText('Test Listing')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
  });

  test('Renders listee name after fetching', async () => {
    render(<BrowserRouter><UserListingCard {...props} /></BrowserRouter>);
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/getuser/user123');
    expect(await screen.findByText('Listed By: John Doe')).toBeInTheDocument();
  });

  test('Delete button calls deleteListing function and reloads page', async () => {
    axios.delete.mockResolvedValueOnce({});
    render(<BrowserRouter><UserListingCard {...props} /></BrowserRouter>);
    fireEvent.click(screen.getByText('Delete'));
    const confirmButton = screen.getByTestId('confirmBtn');
    fireEvent.click(confirmButton);
    expect(axios.delete).toHaveBeenCalledWith('http://localhost:8080/api/listings/listing123', { headers: { 'x-auth-token': "test-token" } });
  });

  test('Edit button links to EditForm component with correct props', () => {
    render(<BrowserRouter><UserListingCard {...props} /></BrowserRouter>);
    fireEvent.click(screen.getByText('Test Listing'));
    render(<BrowserRouter><EditForm {...props} /></BrowserRouter>);

    const nameInput = screen.getByTestId('name');
    const priceInput = screen.getByTestId('price');
    const descriptionInput = screen.getByTestId('desc');
    const subButton = screen.getByTestId('sub-btn');

    expect(screen.getByDisplayValue('Test Listing')).toBeInTheDocument();
    expect(screen.getByDisplayValue('9.99')).toBeInTheDocument();
    expect(screen.getByDisplayValue('This is a test listing')).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    fireEvent.change(priceInput, { target: { value: '10.99' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });

    fireEvent.click(subButton);

    expect(screen.getByDisplayValue('New Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10.99')).toBeInTheDocument();
    expect(screen.getByDisplayValue('New Description')).toBeInTheDocument();
  });
});

describe('Test View Listing Component', () => {
  const props = {
    userId: 'user123',
    Id: 'listing123',
    title: 'Test Listing',
    price: '9.99',
    description: 'This is a test listing',
    condition: 'Good',
    image: 'test.jpg',
    tags: ['test', 'listing'],
  };

  test('Renders item name', () => {
    render(<BrowserRouter><ViewListing {...props} /></BrowserRouter>);
    expect(screen.getByText(props.title));
  });

  test('Renders item price', () => {
    render(<BrowserRouter><ViewListing {...props} /></BrowserRouter>);
    expect(screen.getByText(`$${props.price}`));
  });

  test('Renders item description', () => {
    render(<BrowserRouter><ViewListing {...props} /></BrowserRouter>);
    expect(screen.getByText(props.description));
  });

  test('Renders item condition', () => {
    render(<BrowserRouter><ViewListing {...props} /></BrowserRouter>);
    expect(screen.getByText(`Condition: ${props.condition}`));
  });

  test('Renders item tags', () => {
    render(<BrowserRouter><ViewListing {...props} /></BrowserRouter>);
    const tag1 = screen.getByText(props.tags[0]);
    const tag2 = screen.getByText(props.tags[1]);
    expect(tag1).toBeInTheDocument();
    expect(tag2).toBeInTheDocument();
  });
});