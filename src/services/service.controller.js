import Service from "./service.model.js";

export const getServices = async (req, res) => {
    try {
        const services = await Service.find({ status: true })    

        res.status(200).json({
            success: true,
            msg: "Get services successfully",
            services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error getting services",
            error: error.message
        });
    }
}

export const saveService = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const service = new Service({ name, description, price });
        await service.save();

        res.status(201).json({
            success: true,
            msg: "Service created successfully",
            service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error creating service",
            error: error.message
        });
    }
}

export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const service = await Service.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Service updated successfully",
            service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error updating service",
            error: error.message
        });
    }
}

export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findByIdAndUpdate(id, { status: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: "Service deleted successfully",
            service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error deleting service",
            error: error.message
        });
    }
}

export const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                msg: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Get service successfully",
            service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error getting service",
            error: error.message
        });
    }
}

export const getServiceByName = async (req, res) => {
    try {
        const { name } = req.params;
        const service = await Service.find ({ name: { $regex: name, $options: "i" } });

        if (!service) {
            return res.status(404).json({
                success: false,
                msg: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Get service successfully",
            service
        });

    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error getting service",
            error: error.message
        });
    }
}